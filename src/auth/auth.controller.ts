import { Controller, Post, Request, Get, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './auth.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller()
export class AuthController {
    constructor(private authService: AuthService) { }
    @Public()
    @Post('login')
    async login(
        @Body('client_assertion_type') clientAssertionType: string,
        @Body('client_assertion') clientAssertion: string,
    ): Promise<LoginDto> {
        return this.authService.validateClaim(clientAssertionType, clientAssertion);
    }

    // Test endpoint
    @Get('profile')
    getProfile(@Request() req) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        return req.user;
    }
}
