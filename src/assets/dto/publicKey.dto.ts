import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class PublicKeyDto {
    @ApiProperty({
        example: 'did:nv:0c184915b07b44c888d468be85a9b28253e80070e5294b1aaed81c2f0264e430',
        description: 'Id of the public key',
    })
    @IsString()
    id: string

    @ApiProperty({
        example: '0x00Bd138aBD70e2F00903268F3Db08f2D25677C9e',
        description: 'Wallet address who own the public key',
    })
    @IsString()
    owner: string

    @ApiProperty({
        example: 'EthereumECDSAKey',
        description: 'Type of the public key',
    })
    @IsString()
    type: string
} 