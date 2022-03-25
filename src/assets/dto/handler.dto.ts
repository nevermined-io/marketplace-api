import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class HandlerDto {
  @ApiProperty({
    example: 'fulfill',
    description: 'Function name',
  })
  @IsString()
  functionName: string;

  @ApiProperty({
    example: 'lockPaymentConditon',
    description: 'Module name',
  })
  @IsString()
  moduleName: string;

  @ApiProperty({
    example: '0.1',
    description: 'Version of the handler',
  })
  @IsString()
  version: string;
}
