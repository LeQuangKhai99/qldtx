import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
    
  }

  async validate(username: string, password: string) {
    const user = await this.authService.validateUser(username, password);
    
    if (!user) {
        throw new HttpException({
            status: HttpStatus.FORBIDDEN,
            message: 'Thông tin đăng nhập không chính xác!',
        }, HttpStatus.FORBIDDEN);
    }
    return user;
  }
}