import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { LoginDto } from './dto/login.dto'
import { UserProfileService } from '../user-profiles/user-profile.service'
import { UserProfile } from '../user-profiles/user-profile.entity'
import { PermissionService } from '../permissions/permission.service'
import { ClientAssertionDto } from './dto/clientAssertion.dto'
import { State } from '../common/type'
import { Permission } from '../permissions/permission.entity'
import { JWTPayload, Strategy } from '@nevermined-io/passport-nevermined'
import { Request } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { ConfigService } from '../shared/config/config.service'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userProfileService: UserProfileService,
    private permissionService: PermissionService,
    private configService: ConfigService,
  ) {}

  /**
   * RFC-7523 Client Authentication https://datatracker.ietf.org/doc/html/rfc7523#section-2.2
   * RFC-8812 ECDSA Signature with secp256k1 Curve (ES256K)
   * https://www.rfc-editor.org/rfc/rfc8812#name-ecdsa-signature-with-secp25
   * This implementation is different from the standard in:
   * - the size of the signature. ethereum adds an extra byte to the signature to help
   * with recovering the public key that create the signature
   * - the hash function used. ES256K uses sha-256 while ethereum uses keccak
   **/
  async validateClaim(payload: JWTPayload): Promise<LoginDto> {
    let userProfile: UserProfile

    try {
      const address = payload.iss
      const userProfileSource = await this.userProfileService.findOneByAddress(address)

      if (!userProfileSource) {
        const userProfileEntity = new UserProfile()
        userProfileEntity.nickname = address
        userProfileEntity.isListed = true
        userProfileEntity.addresses = [address]
        userProfileEntity.state = State.Confirmed
        userProfile = await this.userProfileService.createOne(userProfileEntity)
      } else {
        userProfile = userProfileSource._source
      }

      const permission = await this.getPermission(userProfile.userId, address)

      return {
        access_token: this.jwtService.sign({
          iss: address,
          sub: userProfile.userId,
          roles: permission?.type || [],
        }),
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Could not validate the claim: ${(error as Error).message}`,
      )
    }
  }

  async validateNewAddressClaim(
    clientAssertionDto: ClientAssertionDto,
    userId: string,
  ): Promise<LoginDto> {
    let payload: JwtPayload
    const strategy = new Strategy(
      { web3ProviderUri: this.configService.get('WEB3_PROVIDER_URI') },
      (result: JWTPayload) => {
        payload = result
      },
    )

    try {
      await strategy.authenticate({ body: clientAssertionDto } as Request)
    } catch (error) {
      throw new UnauthorizedException(
        `The 'client_assertion' is invalid: ${(error as Error).message}`,
      )
    }

    try {
      const address = payload.iss
      const userProfile = (await this.userProfileService.findOneById(userId))?._source

      if (userProfile.addresses.some((a) => a === address)) {
        throw new UnauthorizedException(
          `The address ${address} already exists in ${userProfile.nickname} account`,
        )
      }

      userProfile.addresses.push(address)

      const userProfileUpdated = (
        await this.userProfileService.updateOneByEntryId(userId, userProfile)
      )?._source

      const permission = await this.getPermission(userId, address)

      return {
        access_token: this.jwtService.sign({
          iss: address,
          sub: userProfileUpdated.userId,
          roles: permission?.type || [],
        }),
      }
    } catch (error) {
      throw new UnauthorizedException(
        `The 'client_assertion' is invalid: ${(error as Error).message}`,
      )
    }
  }

  private async getPermission(userId: string, address: string): Promise<Permission> {
    return (
      await this.permissionService.findManyByUserIdAndType(userId, undefined, {
        page: 1,
        offset: 100,
      })
    ).hits
      .map((p) => p._source)
      .find((p) => p.holder === address)
  }
}
