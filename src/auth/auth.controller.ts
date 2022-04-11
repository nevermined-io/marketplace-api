import { Controller, Post, UseGuards, Request, Get, Param, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './auth.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Auth')
@Controller()
export class AuthController {
    constructor(private authService: AuthService) { }
    // eslint-disable-next-line @typescript-eslint/require-await
    @Public()
    @Post('login')
    async login(
        @Body('client_assertion_type') clientAssertionType: string,
        @Body('client_assertion') clientAssertion: string,
    ): Promise<LoginDto> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return this.authService.validateClaim(clientAssertionType, clientAssertion);
    }

    // Test endpoint
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        console.log(req.user);
        return req.user;
    }
}
