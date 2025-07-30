import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsString()
  password: string;
}
