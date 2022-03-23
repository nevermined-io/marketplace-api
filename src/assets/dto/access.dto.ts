import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';
import { ServiceDto } from './service.dto';

export class AccessDto extends ServiceDto {
  @ApiProperty({
    example: 'http://localhost:8030/api/v1/gateway/services/access/initialize',
    description: 'Url to purchase asset',
  })
  @IsUrl()
  purchaseEndpoint: string;
}
