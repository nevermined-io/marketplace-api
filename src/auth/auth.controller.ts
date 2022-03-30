import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './auth.decorator';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('Auth')
@Controller()
export class AuthController {
    constructor(private authService: AuthService) { }
    // eslint-disable-next-line @typescript-eslint/require-await
    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return this.authService.login(req.user);
    }

    // Test endpoint
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        return req.user;
    }
}
