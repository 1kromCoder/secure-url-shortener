import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Min } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  email: string;
  @ApiProperty({ example: 'strongPass123' })
  @IsString()
  password: string;
}
