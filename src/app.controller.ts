import { Controller, Get, Post, UseGuards, Request, UseFilters } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthenticatedGuard } from './auth/guard/authenticated.guard';
import { AuthExceptionFilter } from './common/filters/auth-exceptions.filter';
import { Roles } from './roles/decorator/roles.decorator';
import { Role } from './roles/enum/role.enum';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get()
  index() {
    return this.appService.index();
  }

  @UseFilters(AuthExceptionFilter)
  @UseGuards(AuthenticatedGuard)
  @Roles(Role.Admin)
  @Get('/admin')
  admin() {
    return this.appService.admin();
  }

  @UseFilters(AuthExceptionFilter)
  @UseGuards(AuthenticatedGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
