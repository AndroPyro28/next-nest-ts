import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { BcryptService } from 'src/bcrypt.service';
import {User} from '@prisma/client'

@Injectable()
export class UserService {

  constructor(private prisma: PrismaService, private bcryptService: BcryptService) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email
      }
    })

    if(!!user) {
      throw new ConflictException('email duplicated')
    }
    const hashPwd = await this.bcryptService.bcryptHash(createUserDto.password)

    const newUser = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashPwd
      }
    })

    const {password, ...rest} = newUser
    
    return {...rest}
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
