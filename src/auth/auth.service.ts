import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from 'jose';
import { CLIENT_ASSERTION_TYPE } from './constants';
import { LoginDto } from './dto/login.dto';
import { jwtEthVerify } from './jwt.utils';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) { }

    /**
     * RFC-7523 Client Authentication https://datatracker.ietf.org/doc/html/rfc7523#section-2.2
     * RFC-8812 ECDSA Signature with secp256k1 Curve (ES256K)
     * https://www.rfc-editor.org/rfc/rfc8812#name-ecdsa-signature-with-secp25
     * This implementation is different from the standard in:
     * - the size of the signature. ethereum adds an extra byte to the signature to help
     * with recovering the public key that create the signature
     * - the hash function used. ES256K uses sha-256 while ethereum uses keccak
     **/
    validateClaim(clientAssertionType: string, clientAssertion: string): LoginDto {
        if (clientAssertionType !== CLIENT_ASSERTION_TYPE) {
            throw new UnauthorizedException('Invalid "client_assertion_type"');
        }

        let payload: JWTPayload;
        try {
            payload = jwtEthVerify(clientAssertion);
        } catch (error) {
            throw new UnauthorizedException(`The 'client_assertion' is invalid: ${(error as Error).message}`);
        }
        return {
            access_token: this.jwtService.sign({ iss: payload.iss })
        };
    }
}
