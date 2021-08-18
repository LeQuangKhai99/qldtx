import { Controller, Post, UseGuards, Request, Get, Render } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthService } from './auth.service';

@Public()
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Get('login')
    @Render('auth/index')
    index() {
        
    }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
        const token = await this.authService.login(req.user);
        localStorage.setItem('token_qldt', token.access_token);
        return token;
    }
}
