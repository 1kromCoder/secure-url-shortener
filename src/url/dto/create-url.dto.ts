import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @ApiProperty({ example: 'http://example.com' })
  @IsUrl()
  originalUrl: string;
}
