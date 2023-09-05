import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { BcryptService } from 'src/common/utils/bcrypt.service';
import { PrismaService } from 'src/common/utils/prisma.service';

@Module({

  controllers: [UserController],
  providers: [UserService, BcryptService, PrismaService]
})
export class UserModule {}
