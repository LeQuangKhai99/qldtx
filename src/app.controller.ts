import { Controller, Get, Post, UseGuards, Request, UseFilters } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthenticatedGuard } from './auth/guard/authenticated.guard';
import { AuthExceptionFilter } from './common/filters/auth-exceptions.filter';

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
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
