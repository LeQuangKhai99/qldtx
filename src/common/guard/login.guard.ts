import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LoginGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext) {
        
        const result = (await super.canActivate(context)) as boolean;
        
        const request = context.switchToHttp().getRequest();
        if(request.body.remember == 'on') {
            request.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
        }
        await super.logIn(request);
        return result;
    }
}