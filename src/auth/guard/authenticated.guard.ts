import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "src/common/decorators/public.decorator";

@Injectable()
export class AuthenticatedGuard implements CanActivate {
    constructor(private reflector: Reflector) {
    }

    async canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if(isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        
        if(!request.isAuthenticated()) {
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: ['Vui lòng đăng nhập!'],
                redirect: '/auth/login'
            }, HttpStatus.FORBIDDEN);
        }
        else {
            return true;
        }
    }
}