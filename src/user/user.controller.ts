import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginUserDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }
  @Post('refresh-token')
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.userService.refresh(dto);
  }
  findAll() {
    return this.userService.findAll();
  }
  @Get('/me')
  me(@Req() req: Request) {
    const userId = req['user-id'];
    return this.userService.me(userId);
  }
  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
