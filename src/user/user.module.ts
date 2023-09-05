import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { BcryptService } from 'src/bcrypt.service';
import { PrismaService } from 'src/prisma.service';

@Module({

  controllers: [UserController],
  providers: [UserService, BcryptService, PrismaService]
})
export class UserModule {}
