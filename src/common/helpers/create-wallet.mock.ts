import { AuthService } from '../../auth/auth.service'
import { ethers } from 'ethers'
import { JWTPayload } from '@nevermined-io/passport-nevermined'

export const createWallet = async (authService: AuthService) => {
  const wallet = ethers.Wallet.createRandom()
  const jwtPayload: JWTPayload = {
    iss: await wallet.getAddress(),
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000 + 3600),
  }

  const accessToken = authService.validateClaim(jwtPayload)
  return accessToken
}
