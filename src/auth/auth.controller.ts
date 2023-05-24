import {
  Body,
  Controller,
  Get,
  Session as GetSession,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Session } from 'express-session';
import { User } from 'src/users/entities/user.entity';
import { AUTH_ERRORS } from './auth.constants';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('me')
  @ApiResponse({
    status: 200,
    description: 'authenticated user',
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: AUTH_ERRORS.UNAUTHORIZED_EXCEPTION,
  })
  @ApiResponse({
    status: 400,
    description: AUTH_ERRORS.INVALID_EXCEPTION,
  })
  async me(@GetSession() session: Session) {
    if (!session.user) {
      throw new UnauthorizedException(AUTH_ERRORS.UNAUTHORIZED_EXCEPTION);
    }

    return await this.authService.whoIAm(session.user.email);
  }

  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'successfully logged in.',
  })
  @ApiResponse({
    status: 400,
    description: AUTH_ERRORS.CREDENTIALS_EXCEPTION,
  })
  async login(@Body() loginDto: AuthDto, @GetSession() session: Session) {
    const userData = await this.authService.signIn(loginDto);

    session.user = {
      email: userData.userEmail,
    };

    return {
      data: userData,
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  @ApiResponse({
    status: 204,
    description: 'successfully logged out.',
  })
  async logout(@GetSession() session: Session) {
    // check latter
    return new Promise((resolve, reject) => {
      session.destroy((err) => {
        if (err) reject(err);
        resolve(undefined);
      });
    });
  }
}
