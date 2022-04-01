import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString } from 'class-validator';

export class ProofDto {
  @ApiProperty({
    example: '2022-01-08T16:02:20Z',
    description: 'Date of the proof',
  })
  @IsDateString()
  created: string;

  @ApiProperty({
    example: '0xA99D43d86A0758d5632313b8fA3972B6088A21BB',
    description: 'Wallet address who created the proof signature',
  })
  @IsString()
  creator: string;

  @ApiProperty({
    example:
      '0xbd7b46b3ac664167bc70ac211b1a1da0baed9ead91613a5f02dfc25c1bb6e3' +
      'ff40861b455017e8a587fd4e37b703436072598c3a81ec88be28bfe33b61554a471b',
    description: 'Value of the signature',
  })
  @IsString()
  signatureValue: string;

  @ApiProperty({
    example: 'DDOIntegritySignature',
    description: 'Type of the proof',
  })
  @IsString()
  type: string;
}
