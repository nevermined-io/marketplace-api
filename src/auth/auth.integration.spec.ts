import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { Account } from '@nevermined-io/nevermined-sdk-js';
import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { EthSignJWT } from './jwt.utils';

describe('AuthController', () => {
  let app: INestApplication;
  let account: Account;
  let web3: Web3;
  let accessToken: string;

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

    app = module.createNestApplication();
    await app.init();
  });

  it('/POST login', async () => {
    const clientAssertion = await new EthSignJWT({
      iss: web3.utils.toChecksumAddress(account.getId())
    })
      .setProtectedHeader({ alg: 'ES256K' })
      .setIssuedAt()
      .setExpirationTime('60m')
      .ethSign(account, web3);

    const clientAssertionType = 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer';
    const response = await request(app.getHttpServer())
      .post('/login')
      .send(`client_assertion_type=${clientAssertionType}&client_assertion=${clientAssertion}`);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('access_token');

  });
});
