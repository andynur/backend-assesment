import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule, QueryInfo, loggingMiddleware } from 'nestjs-prisma';
import { AuthModule } from './auth/auth.module';
import { PrescriptionDetailsModule } from './prescription-details/prescription-details.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { ProductsModule } from './products/products.module';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { CheckAuthCookieMiddleware } from './shared/middlewares/check-auth-cookie/check-auth-cookie.middleware';
import { GlobalFilter } from './shared/middlewares/global/global.filter';
import { GlobalMiddleware } from './shared/middlewares/global/global.middleware';
import { PasswordHashModule } from './shared/providers/password-hash/password-hash.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel: 'log', // default is `debug`
            logMessage: (query: QueryInfo) =>
              `[Prisma Query] ${query.model}.${query.action} - ${query.executionTime}ms`,
          }),
        ],
      },
    }),
    UsersModule,
    AuthModule,
    PasswordHashModule,
    ProductsModule,
    ProductsModule,
    PrescriptionsModule,
    PrescriptionDetailsModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_FILTER, useClass: GlobalFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GlobalMiddleware).forRoutes('*');
    consumer
      .apply(CheckAuthCookieMiddleware)
      .exclude('/api/v1/auth/(.*)')
      .forRoutes('*');
  }
}
