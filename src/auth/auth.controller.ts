import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private userService: UserService) {}

  @Post('register')
  async registerUser(@Body() createAuthDto: CreateUserDto) {
    return this.userService.create(createAuthDto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);

  } 


}
