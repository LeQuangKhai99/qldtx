import { Controller, Post, UseGuards, Request, Get, Render, Res, UseFilters } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthExceptionFilter } from 'src/common/filters/auth-exceptions.filter';
import { LoginGuard } from 'src/common/guard/login.guard';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local.guard';

@Public()
@Controller('auth')
@UseFilters(AuthExceptionFilter)
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Get('login')
    @Render('auth/index')
    index(@Request() req): { message: string } {
        return { message: req.flash('loginError') };
    }

    // @UseGuards(LocalAuthGuard)
    @UseGuards(LoginGuard)
    @Post('login')
    login(@Res() res: Response) {
        res.redirect('/');
    }
//     async login(@Request() req) {
//         const token = await this.authService.login(req.user);
//         return token;
//     }
}
