import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import { BcryptService } from 'src/common/utils/bcrypt.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  private EXPIRE_TIME = 20 * 1000 ;
  /**
   *
   */
  constructor(
    private userService: UserService,
    private Bcrypt: BcryptService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);
    const payload = {
      id: user.id,
      sub: {
        name: user.name,
        email: user.email,
      }
    }

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '20s',
      secret: process.env.JWT_ACCESSTOKEN_SECRET_KEY
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_REFRESHTOKEN_SECRET_KEY
    });

    return {
      user,
      authTokens: {
        accessToken,
        refreshToken,
        expiresIn: new Date().setTime(new Date().getTime() + this.EXPIRE_TIME),
      }
    };
  }

  private async validateUser(dto: LoginDto) {
    
    const user = await this.userService.findByEmail(dto.email);

    const isMatch = await this.Bcrypt.bcryptCompare(
      dto.password,
      user.password,
    );


    if(!isMatch) {
      throw new UnauthorizedException('Invalid Credentials');
    }

      const { password, ...rest } = user;

      return { ...rest };
  }


  async refreshToken(user: any) {
    const payload = {
      id: user.id,
      sub: user.sub
    }

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
      secret: process.env.JWT_ACCESSTOKEN_SECRET_KEY
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_REFRESHTOKEN_SECRET_KEY
    });
    
    return {
        accessToken,
        refreshToken,
        expiresIn: new Date().setTime(new Date().getTime() + this.EXPIRE_TIME),
    };

  }
}
