import { ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LoginGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        
        const {username, password} = request.body;
        
        if(!username || !password) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: ['Vui lòng nhập đầy đủ thông tin !'],
                redirect: '/auth/login'
            }, HttpStatus.BAD_REQUEST);
        }
        const result = (await super.canActivate(context)) as boolean;
        
        if(request.body.remember == 'on') {
            request.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
        }
        await super.logIn(request);
        return result;
    }
}