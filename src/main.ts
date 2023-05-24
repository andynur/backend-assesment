import { LogLevel, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as connectRedis from 'connect-redis';
import * as session from 'express-session';
import Redis from 'ioredis';
import { PrismaService } from 'nestjs-prisma';
import { AppModule } from './app.module';

const RedisStore = connectRedis(session);

// add environment variable
const redisClient = new Redis('redis://localhost:6379');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(process.env.NODE_ENV === 'production'),
  });

  // set api versioning strategies
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const config = new DocumentBuilder()
    .setTitle('Lifepack Assessment API')
    .setDescription('Simple Pharmacy API')
    .setVersion('1.0')
    .addCookieAuth('optional-session-id')
    .setExternalDoc('Postman Collection', '/docs-json')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
      }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 15,
      },
    }),
  );

  // enable prisma shutdown hook
  const prismaService: PrismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  await app.listen(8000);
}

function getLogLevels(isProduction: boolean): LogLevel[] {
  if (isProduction) {
    return ['log', 'warn', 'error'];
  }
  return ['error', 'warn', 'log', 'verbose', 'debug'];
}

export default getLogLevels;
bootstrap();
