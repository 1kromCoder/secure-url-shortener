import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}
  @UseGuards(AuthGuard)
  @Post('shorten')
  async shorten(@Body() dto: CreateUrlDto, @Request() req: any) {
    const userId = req['user-id'];
    return this.urlService.createShortUrl(dto, userId);
  }
  @Get('/:shortCode')
  async redirect(@Param('shortCode') code: string, @Res() res: Response) {
    const url = await this.urlService.findByShortCode(code);
    if (!url) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    await this.urlService.incrementVisits(code);
    return res.redirect(url.originalUrl);
  }
  @UseGuards(AuthGuard)
  @Get('stats/:shortCode')
  async stats(@Param('shortCode') code: string, @Request() req: any) {
    const userId = req['user-id'];
    const stats = await this.urlService.getStats(code, userId);
    if (!stats)
      throw new HttpException('Not Found or Forbidden', HttpStatus.NOT_FOUND);
    return stats;
  }
}
