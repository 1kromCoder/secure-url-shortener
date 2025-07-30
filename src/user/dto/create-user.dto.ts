import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword, Min } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  email: string;
  @ApiProperty({ example: 'strongPass123' })
  @IsString()
  password: string;
}
