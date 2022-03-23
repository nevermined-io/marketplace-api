import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';

export abstract class ServiceDto {
  @ApiProperty({
    example: 0,
    description: 'index of the service',
  })
  @IsInt()
  index: number;

  @ApiProperty({
    example: 'http://localhost:8030/api/v1/gateway/services/consume',
    description: 'Url of the service endpoint',
  })
  @IsString()
  serviceEndpoint: string;

  @ApiProperty({
    example: 'access',
    description: 'Service type',
  })
  @IsString()
  type: string;
}
