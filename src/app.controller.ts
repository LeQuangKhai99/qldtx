import { Controller, Get, Post, UseGuards, Request, UseFilters, Render, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthenticatedGuard } from './auth/guard/authenticated.guard';
import { Public } from './common/decorators/public.decorator';
import { AuthExceptionFilter } from './common/filters/auth-exceptions.filter';
import { Roles } from './roles/decorator/roles.decorator';
import { Role } from './roles/enum/role.enum';

@UseFilters(AuthExceptionFilter)
@UseGuards(AuthenticatedGuard)
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Public()
  @Get()
  index(@Req() req, @Res() res) {
    res.render('static/index', {
      layout: false
    });
  }

  @Roles(Role.Admin)
  @Get('/admin')
  admin(@Req() req, @Res() res) {
    res.render('admin/index', {
      title: 'Dashboard',
      error: req.flash('error'),
      success: req.flash('success'),
    });
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
