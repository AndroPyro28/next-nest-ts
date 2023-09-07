import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { BcryptService } from 'src/common/utils/bcrypt.service';
import { PrismaService } from 'src/common/utils/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({

  controllers: [UserController],
  providers: [UserService, BcryptService, PrismaService, JwtService]
})
export class UserModule {}
