import { CanActivate, ExecutionContext, ForbiddenException, HttpException, HttpStatus, Injectable, Req } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorator/roles.decorator";
import { Role } from "../enum/role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        if(!requiredRoles) {
            return true;
        }

        const {user} = context.switchToHttp().getRequest();
        if(!user) {
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                message: 'Vui lòng đăng nhập!',
            }, HttpStatus.FORBIDDEN);
        }
        const roles = user.roles?.map((item) => {
            return item.name
        })
        
        if(requiredRoles.some((role) => roles.includes(role))) {
            return true;
        }
        else {
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                message: 'Tài khoản của bạn không có quyền thực hiện chức năng này!',
            }, HttpStatus.FORBIDDEN);
        }
    }
}