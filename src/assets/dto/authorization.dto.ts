import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ServiceDto } from './service.dto';

export class AuthorizationDto extends ServiceDto {
  @ApiProperty({
    example: 'SecretStore',
    description: 'Service name',
  })
  @IsString()
  service: string;
}
