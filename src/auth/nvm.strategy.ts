import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, JWTPayload } from '@nevermined-io/passport-nevermined'
import { State } from '../common/type'
import { Permission } from '../permissions/permission.entity'
import { PermissionService } from '../permissions/permission.service'
import { UserProfile } from '../user-profiles/user-profile.entity'
import { UserProfileService } from '../user-profiles/user-profile.service'

@Injectable()
export class NeverminedStrategy extends PassportStrategy(Strategy) {
  constructor(
    private jwtService: JwtService,
    private userProfileService: UserProfileService,
    private permissionService: PermissionService,
  ) {
    super()
  }

  async validate(payload: JWTPayload) {
    console.log('calling validate', payload)
    const address = payload.iss

    const userProfileSource = await this.userProfileService.findOneByAddress(address)

    let userProfile: UserProfile
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
