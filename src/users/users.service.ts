import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { PasswordHashService } from 'src/shared/providers/password-hash/password-hash.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_DELETED, USER_ERRORS } from './users.constants';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordHash: PasswordHashService,
  ) {}

  userSelect = {
    id: true,
    name: true,
    email: true,
  };

  async create(createUserDto: CreateUserDto) {
    const emailIsAvailable = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (emailIsAvailable) {
      throw new HttpException(
        USER_ERRORS.DUPLICATE_EMAIL_EXCEPTION,
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await this.passwordHash.hashPassword(
      createUserDto.password,
    );
    const user = await this.prisma.user.create({
      data: { ...createUserDto, password: hashedPassword },
    });

    const { id, name, email } = user;

    return { id, name, email };
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        ...this.userSelect,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: this.userSelect,
    });

    if (!user) {
      throw new HttpException(
        USER_ERRORS.INVALID_EXCEPTION,
        HttpStatus.BAD_REQUEST,
      );
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    //check updated email for uniqueness constraint
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new HttpException(
        USER_ERRORS.INVALID_EXCEPTION,
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: updateUserDto,
      select: this.userSelect,
    });

    return updatedUser;
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new HttpException(
        USER_ERRORS.INVALID_EXCEPTION,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prisma.user.delete({
      where: {
        id: user.id,
      },
    });

    return {
      msg: USER_DELETED,
    };
  }
}
