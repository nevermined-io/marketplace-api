import { AuthService } from '../../auth/auth.service';
import { CLIENT_ASSERTION_TYPE, EthSignJWT } from '../guards/shared/jwt.utils';
import { ethers } from 'ethers';

export const createWallet = async (authService: AuthService) => {
  const wallet = ethers.Wallet.createRandom();
  const clientAssertion = await new EthSignJWT({
    iss: wallet.address,
  })
    .setProtectedHeader({ alg: 'ES256K' })
    .setIssuedAt()
    .setExpirationTime('60m')
    .ethSign(wallet);

  return authService.validateClaim(CLIENT_ASSERTION_TYPE, clientAssertion);
};
