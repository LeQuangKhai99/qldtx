import { Controller, Post, UseGuards, Get, Render, Res, UseFilters, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthExceptionFilter } from 'src/common/filters/auth-exceptions.filter';
import { LoginGuard } from 'src/common/guard/login.guard';
import { AuthService } from './auth.service';

@Public()
@Controller('auth')
@UseFilters(AuthExceptionFilter)
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Get('login')
    index(@Req() req, @Res() res) {
        res.render('auth/index', {
            layout: false,
            message: req.flash('loginError')
        });
    }

    @UseGuards(LoginGuard)
    @Post('login')
    login(@Req() req: Request,@Res() res: Response) {
        res.redirect('/');
    }

    @Get('logout')
    logout(@Req() req: Request, @Res() res: Response) {
        req.logOut();
        res.redirect('/');
    }
}
