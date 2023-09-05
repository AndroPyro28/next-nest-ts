import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/common/utils/prisma.service';
import { BcryptService } from 'src/common/utils/bcrypt.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService, PrismaService, BcryptService, JwtService]
})
export class AuthModule {}
