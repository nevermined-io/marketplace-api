import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, JWTPayload } from '@nevermined-io/passport-nevermined'
import { ConfigService } from '../shared/config/config.service'

@Injectable()
export class NeverminedStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      web3ProviderUri: configService.get('WEB3_PROVIDER_URI'),
    })
  }

  async validate(payload: JWTPayload): Promise<JWTPayload> {
    return payload
  }
}
