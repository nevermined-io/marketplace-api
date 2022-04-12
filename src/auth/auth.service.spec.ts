import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { decodeJwt } from 'jose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import HDWalletProvider from '@truffle/hdwallet-provider';
import { Account } from '@nevermined-io/nevermined-sdk-js';
import { EthSignJWT } from './jwt.utils';
import Web3 from 'web3';

describe('AuthService', () => {
  let service: AuthService;
  let web3: Web3;
  let account: Account;

  beforeAll(() => {
    const seedphrase = 'taxi music thumb unique chat sand crew more leg another off lamp';
    const provider = new HDWalletProvider(seedphrase, 'http://localhost:8545', 0, 10);
    const address: string = provider.getAddresses()[0];
    account = new Account(address);
    web3 = new Web3(provider);
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get a token with web3 signing', async () => {

    const clientAssertion = await new EthSignJWT({
      iss: web3.utils.toChecksumAddress(account.getId())
    })
      .setProtectedHeader({ alg: 'ES256K' })
      .setIssuedAt()
      .setExpirationTime('60m')
      .ethSign(account, web3);

    const result = await service.validateClaim(
      'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
      clientAssertion
    );
    expect(result).toHaveProperty('access_token');

    const payload = decodeJwt(result.access_token);
    expect(payload.iss).toEqual(web3.utils.toChecksumAddress(account.getId()));
  });

});
