import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async findUserByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }

  async register(data: CreateUserDto) {
    try {
      const existingUser = await this.findUserByEmail(data.email);
      if (existingUser) {
        throw new ConflictException('Foydalanuvchi allaqachon mavjud');
      }

      const hash = bcrypt.hashSync(data.password, 10);

      const newUser = await this.prisma.user.create({
        data: {
          ...data,
          password: hash,
        },
      });

      return newUser;
    } catch (error) {
      throw new InternalServerErrorException('Ro‘yxatdan o‘tishda xatolik');
    }
  }

  async findAll() {
    try {
      const all = await this.prisma.user.findMany();
      return all;
    } catch (error) {
      throw new InternalServerErrorException(
        'Foydalanuvchilarni olishda xatolik',
      );
    }
  }

  async login(data: LoginUserDto) {
    try {
      if (!data.email || !data.password) {
        throw new UnauthorizedException('Email yoki parol yo‘q');
      }

      const user = await this.findUserByEmail(data.email);
      if (!user) {
        throw new UnauthorizedException('Foydalanuvchi topilmadi');
      }

      const match = bcrypt.compareSync(data.password, user.password);
      if (!match) {
        throw new UnauthorizedException('Parol noto‘g‘ri');
      }

      const access_token = this.jwt.sign({ id: user.id });
      const refresh_token = this.jwt.sign({ id: user.id });

      return { access_token, refresh_token };
    } catch (error) {
      throw new InternalServerErrorException('Kirishda xatolik');
    }
  }

  async me(userId: number) {
    try {
      if (!userId) {
        throw new UnauthorizedException('User ID yo‘q');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          password: true,
        },
      });

      if (!user) {
        throw new NotFoundException('Foydalanuvchi topilmadi');
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException('Maʼlumotni olishda xatolik');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new NotFoundException('Foydalanuvchi topilmadi');
      }

      return await this.prisma.user.update({
        where: { id },
        data: {
          ...updateUserDto,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Yangilashda xatolik');
    }
  }

  async remove(id: number) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new NotFoundException('Foydalanuvchi topilmadi');
      }

      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException('O‘chirishda xatolik');
    }
  }

  async refresh(data: RefreshTokenDto) {
    try {
      const user = this.jwt.verify(data.refreshToken);
      const newAccestoken = this.jwt.sign({ id: user.id });
      return { newAccestoken };
    } catch (error) {
      throw new InternalServerErrorException('Token yangilashda xatolik');
    }
  }
}
