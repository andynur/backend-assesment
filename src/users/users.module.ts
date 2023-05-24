import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PasswordHashModule } from 'src/shared/providers/password-hash/password-hash.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [PasswordHashModule, AuthModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
