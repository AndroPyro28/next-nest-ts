import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/auth.dto';
import { RefreshJwtGuard } from 'src/common/guards/refresh.guard';
import { Request } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private userService: UserService) {}

  @Post('register')
  async registerUser(@Body() createAuthDto: CreateUserDto) {
    return this.userService.create(createAuthDto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    console.log('login hitted')
    return this.authService.login(dto);

  } 

  @UseGuards(RefreshJwtGuard)
  @Get('refresh')
  async refreshToken(@Req() req) {
    return await this.authService.refreshToken(req.user)
  }


}
