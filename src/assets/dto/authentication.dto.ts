import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthenticationDto {
    @ApiProperty({
        example: 'did:nv:0c184915b07b44c888d468be85a9b28253e80070e5294b1aaed81c2f0264e430',
        description: 'Public key of ddo'
    })
    @IsString()
    publicKey: string;

    @ApiProperty({
        example: 'RsaSignatureAuthentication2018',
        description: 'Type of the signature',
    })
    type: string;
}