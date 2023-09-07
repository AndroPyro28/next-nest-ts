import { ConflictException, Injectable, Param, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/common/utils/prisma.service';
import { BcryptService } from 'src/common/utils/bcrypt.service';
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

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where:{
        email
      }
    })

    if(!user) {
      throw new UnauthorizedException('Invalid Credentials')
    }

    return user;
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where:{
        id
      }
    })

    if(!user) {
      throw new UnauthorizedException('Invalid Credentials')
    }

    const {password, ...rest} = user;

    return {...rest};
  }

  findAll() {
    return `This action returns all user`;
  }
   
}
