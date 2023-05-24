import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { PasswordHashService } from 'src/shared/providers/password-hash/password-hash.service';
import { AUTH_ERRORS } from './auth.constants';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private passwordHash: PasswordHashService,
  ) {}

  userSelect = {
    id: true,
    name: true,
    email: true,
  };

  async whoIAm(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: this.userSelect,
    });
    if (!user) {
      throw new HttpException(
        AUTH_ERRORS.INVALID_EXCEPTION,
        HttpStatus.BAD_REQUEST,
      );
    }

    return user;
  }

  async signIn({ email, password }: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException(
        AUTH_ERRORS.CREDENTIALS_EXCEPTION,
        HttpStatus.BAD_REQUEST,
      );
    }

    const isPasswordMatch = await this.passwordHash.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new HttpException(
        AUTH_ERRORS.CREDENTIALS_EXCEPTION,
        HttpStatus.BAD_REQUEST,
      );
    }

    const { id, name, email: userEmail } = user;
    const userInformation = { id, name, userEmail };

    return userInformation;
  }
}
