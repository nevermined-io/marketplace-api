import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { decodeJwt } from 'jose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { EthSignJWT } from './jwt.utils';
import { ethers } from 'ethers';

describe('AuthService', () => {
  let service: AuthService;
  let wallet: ethers.Wallet;

  beforeAll(() => {
    wallet = ethers.Wallet.createRandom();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60m' }
        })
      ],
      providers: [AuthService, JwtStrategy],
      controllers: [AuthController]
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should get an access token with an ethereum signed claim', async () => {

    const clientAssertion = await new EthSignJWT({
      iss: wallet.address
    })
      .setProtectedHeader({ alg: 'ES256K' })
      .setIssuedAt()
      .setExpirationTime('60m')
      .ethSign(wallet);

    const result = service.validateClaim(
      'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
      clientAssertion
    );
    expect(result).toHaveProperty('access_token');

    const payload = decodeJwt(result.access_token);
    expect(payload.iss).toEqual(wallet.address);
  });

});
