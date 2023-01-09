import { Controller, Post, Body, Req } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { Public } from '../common/decorators/auth.decorator'
import { AuthService } from './auth.service'
import { ClientAssertionDto } from './dto/clientAssertion.dto'
import { LoginDto } from './dto/login.dto'
import { Request } from '../common/helpers/request.interface'

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
    return this.authService.validateClaim(clientAssertion.client_assertion_type, clientAssertion.client_assertion)
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
    @Req() req: Pick<Request<ClientAssertionDto>, 'user'>
  ) {
    return this.authService.validateNewAddressClaim(clientAssertionDto, req.user.userId)
  }
}
