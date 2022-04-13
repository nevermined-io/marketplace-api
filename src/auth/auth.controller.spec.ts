import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { ethers } from 'ethers';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { EthSignJWT } from './jwt.utils';

describe('AuthController', () => {
    let authController: AuthController;
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

        authController = module.get<AuthController>(AuthController);
    });

    it('should get an access_token', async () => {
        const clientAssertion = await new EthSignJWT({
            iss: wallet.address
        })
            .setProtectedHeader({ alg: 'ES256K' })
            .setIssuedAt()
            .setExpirationTime('60m')
            .ethSign(wallet);
        const clientAssertionType = 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer';

        const response = authController.login(clientAssertionType, clientAssertion);
        expect(response).toHaveProperty('access_token');
    });
});
