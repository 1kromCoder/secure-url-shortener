import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ example: 'token' })
  @IsString()
  refreshToken: string;
}
