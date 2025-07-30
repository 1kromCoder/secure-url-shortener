import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUrlDto } from './dto/create-url.dto';

@Injectable()
export class UrlService {
  constructor(private readonly prisma: PrismaService) {}

  async createShortUrl(dto: CreateUrlDto, userId: number) {
    try {
      const shortCode = this.generateShortCode();
      const shortUrl = `http://localhost:3000/${shortCode}`;

      const url = await this.prisma.url.create({
        data: {
          originalUrl: dto.originalUrl,
          shortCode,
          userId,
        },
      });

      return {
        shortCode: url.shortCode,
        shortUrl,
      };
    } catch (error) {
      throw new InternalServerErrorException('URL yaratishda xatolik');
    }
  }

  private generateShortCode(length = 6): string {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join('');
  }

  async findByShortCode(code: string) {
    try {
      const url = await this.prisma.url.findUnique({
        where: { shortCode: code },
      });

      if (!url) {
        throw new NotFoundException('Bunday short code mavjud emas');
      }

      return url;
    } catch (error) {
      throw new InternalServerErrorException('Short URLni topishda xatolik');
    }
  }

  async incrementVisits(code: string) {
    try {
      return await this.prisma.url.update({
        where: { shortCode: code },
        data: { visits: { increment: 1 } },
      });
    } catch (error) {
      throw new InternalServerErrorException('Visitsni oshirishda xatolik');
    }
  }

  async getStats(code: string, userId: number) {
    try {
      const url = await this.prisma.url.findFirst({
        where: {
          shortCode: code,
          userId,
        },
        select: {
          originalUrl: true,
          createdAt: true,
          visits: true,
        },
      });

      if (!url) {
        throw new NotFoundException('Statistika topilmadi');
      }

      return url;
    } catch (error) {
      throw new InternalServerErrorException('Statistikani olishda xatolik');
    }
  }
}
