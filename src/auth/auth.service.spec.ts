import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { decodeJwt } from 'jose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CLIENT_ASSERTION_TYPE } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { EthSignJWT } from './jwt.utils';
import { ethers } from 'ethers';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigModule } from '../shared/config/config.module';
import { ConfigService } from '../shared/config/config.service';

describe('AuthService', () => {
  let service: AuthService;
  let wallet: ethers.Wallet;
  let clientAssertion: string;

  beforeAll(() => {
    wallet = ethers.Wallet.createRandom();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        PassportModule,
        JwtModule.register({
          secret: 'secret',
          signOptions: { expiresIn: '60m' }
        })
      ],
      providers: [AuthService, JwtStrategy, ConfigService],
      controllers: [AuthController]
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should get an access token with an ethereum signed claim', async () => {

    clientAssertion = await new EthSignJWT({
      iss: wallet.address
    })
      .setProtectedHeader({ alg: 'ES256K' })
      .setIssuedAt()
      .setExpirationTime('60m')
      .ethSign(wallet);

    const result = service.validateClaim(
      CLIENT_ASSERTION_TYPE,
      clientAssertion
    );
    expect(result).toHaveProperty('access_token');

    const payload = decodeJwt(result.access_token);
    expect(payload.iss).toEqual(wallet.address);
  });

  it('should fail with a wrong client_assertion_type', () => {
    expect(() => service.validateClaim('', clientAssertion))
      .toThrowError(UnauthorizedException);
    expect(() => service.validateClaim('', clientAssertion))
      .toThrowError(/Invalid "client_assertion_type"/);
  });

  it('should fail with a malformed JWT', () => {
    expect(() => service.validateClaim(CLIENT_ASSERTION_TYPE, ''))
      .toThrowError(UnauthorizedException);
    expect(() => service.validateClaim(CLIENT_ASSERTION_TYPE, ''))
      .toThrowError(/Invalid Compact JWS/);
  });

  it('should fail with wrong algorithm', async () => {
    const wrongClientAssertion = await new EthSignJWT({
      iss: wallet.address
    })
      .setProtectedHeader({ alg: 'bla' })
      .setIssuedAt()
      .setExpirationTime('60m')
      .ethSign(wallet);

    expect(() => service.validateClaim(CLIENT_ASSERTION_TYPE, wrongClientAssertion))
      .toThrowError(UnauthorizedException);
    expect(() => service.validateClaim(CLIENT_ASSERTION_TYPE, wrongClientAssertion))
      .toThrowError(/Invalid algorithm/);
  });

  it('should fail if iss is not present in the claim', async () => {
    const wrongClientAssertion = await new EthSignJWT({
    })
      .setProtectedHeader({ alg: 'ES256K' })
      .setIssuedAt()
      .setExpirationTime('60m')
      .ethSign(wallet);

    expect(() => service.validateClaim(CLIENT_ASSERTION_TYPE, wrongClientAssertion))
      .toThrowError(UnauthorizedException);
    expect(() => service.validateClaim(CLIENT_ASSERTION_TYPE, wrongClientAssertion))
      .toThrowError(/"iss" field is required/);
  });

  it('should fail if iss is not a valid ethereum address', async () => {
    const wrongClientAssertion = await new EthSignJWT({
      iss: 'bla'
    })
      .setProtectedHeader({ alg: 'ES256K' })
      .setIssuedAt()
      .setExpirationTime('60m')
      .ethSign(wallet);

    expect(() => service.validateClaim(CLIENT_ASSERTION_TYPE, wrongClientAssertion))
      .toThrowError(UnauthorizedException);
    expect(() => service.validateClaim(CLIENT_ASSERTION_TYPE, wrongClientAssertion))
      .toThrowError(/"iss" field must be a valid ethereum address/);
  });

  it('should fail if iss is not a checksum address', async () => {
    const wrongClientAssertion = await new EthSignJWT({
      iss: wallet.address.toLowerCase()
    })
      .setProtectedHeader({ alg: 'ES256K' })
      .setIssuedAt()
      .setExpirationTime('60m')
      .ethSign(wallet);

    expect(() => service.validateClaim(CLIENT_ASSERTION_TYPE, wrongClientAssertion))
      .toThrowError(UnauthorizedException);
    expect(() => service.validateClaim(CLIENT_ASSERTION_TYPE, wrongClientAssertion))
      .toThrowError(/"iss" field must be a checksum address/);
  });

  it('should fail if iss is not the signer of the JWT', async () => {
    const walletOther = ethers.Wallet.createRandom();
    const wrongClientAssertion = await new EthSignJWT({
      iss: wallet.address
    })
      .setProtectedHeader({ alg: 'ES256K' })
      .setIssuedAt()
      .setExpirationTime('60m')
      .ethSign(walletOther);

    expect(() => service.validateClaim(CLIENT_ASSERTION_TYPE, wrongClientAssertion))
      .toThrowError(UnauthorizedException);
    expect(() => service.validateClaim(CLIENT_ASSERTION_TYPE, wrongClientAssertion))
      .toThrowError(/"iss" is not the signer of the payload/);
  });
});
