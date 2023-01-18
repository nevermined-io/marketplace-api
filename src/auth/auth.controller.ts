import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { Public } from '../common/decorators/auth.decorator'
import { AuthService } from './auth.service'
import { ClientAssertionDto } from './dto/clientAssertion.dto'
import { LoginDto } from './dto/login.dto'
import { Request } from '../common/helpers/request.interface'
import { NeverminedGuard } from './nvm.guard'

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    description: 'Login using a JWT claim for client authentication',
    summary: 'Public',
  })
  @ApiResponse({
    status: 201,
    description: 'The access_token',
    type: LoginDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
  })
  @Public()
  login(@Body() clientAssertion: ClientAssertionDto): Promise<LoginDto> {
    return this.authService.validateClaim(
      clientAssertion.client_assertion_type,
      clientAssertion.client_assertion,
    )
  }

  @Post('login2')
  @ApiOperation({
    description: 'Login using a JWT claim for client authentication',
    summary: 'Public',
  })
  @ApiResponse({
    status: 201,
    description: 'The access_token',
    type: LoginDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
  })
  @Public()
  @UseGuards(NeverminedGuard)
  async login2(@Req() req, @Body() _clientAssertion: ClientAssertionDto): Promise<LoginDto> {
    console.log(req.headers)
    console.log('calling login2', req.user)
    return req.user
  }

  @Post('address')
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    description: 'Add address to existing user profile',
  })
  @ApiResponse({
    status: 201,
    description: 'The access_token',
    type: LoginDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  authNewAddress(
    @Body() clientAssertionDto: ClientAssertionDto,
    @Req() req: Pick<Request<ClientAssertionDto>, 'user'>,
  ) {
    return this.authService.validateNewAddressClaim(clientAssertionDto, req.user.userId)
  }
}
