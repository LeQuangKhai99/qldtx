import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get()
  index() {
    return this.appService.index();
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
