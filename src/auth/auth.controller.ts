import { Controller, Post, UseGuards, Request, Get, Render } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local.guard';

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

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        const token = await this.authService.login(req.user);
        return token;
    }
}
