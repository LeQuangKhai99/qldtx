import { Controller, Get, Post, UseGuards, Request, UseFilters, Req, Res } from '@nestjs/common';
import { AuthenticatedGuard } from './auth/guard/authenticated.guard';
import { CategoriesService } from './categories/categories.service';
import { Public } from './common/decorators/public.decorator';
import { AuthExceptionFilter } from './common/filters/auth-exceptions.filter';
import { Roles } from './roles/decorator/roles.decorator';
import { Role } from './roles/enum/role.enum';

@UseFilters(AuthExceptionFilter)
@UseGuards(AuthenticatedGuard)
@Controller()
export class AppController {
  constructor(
    private readonly categoryService: CategoriesService,
  ) {}

  @Public()
  @Get()
  async index(@Req() req, @Res() res) {
    const categories = await this.categoryService.getAll();
    
    res.render('static/index', {
      layout: 'static/layout/main',
      categories
    });
  }

  @Roles(Role.Admin)
  @Get('/admin')
  admin(@Req() req, @Res() res) {
    res.render('admin/index', {
      title: 'Dashboard',
      error: req.flash('error'),
      success: req.flash('success'),
      user: req.user
    });
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
