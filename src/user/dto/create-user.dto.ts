import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'example@gmai.com' })
  @IsEmail()
  email: string;
  @ApiProperty({ example: 'strongPass123' })
  @IsString()
  password: string;
}
