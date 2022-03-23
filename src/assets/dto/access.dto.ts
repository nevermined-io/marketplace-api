import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsUrl } from 'class-validator';

export class AccessDto {
    @ApiProperty({
        example: 0,
        description: 'index of the service',
    })
    @IsInt()
    index: number;

    @ApiProperty({
        example: 'http://localhost:8030/api/v1/gateway/services/access/initialize',
        description: 'Url to purchase asset',
    })
    @IsUrl()
    purchaseEndpoint: string;

    @ApiProperty({
        example: 'http://localhost:8030/api/v1/gateway/services/consume',
        description: 'Url of the service endpoint',
    })
    @IsUrl()
    serviceEndpoint: string;

    @ApiProperty({
        example: 'access',
        description: 'Service type',
    })
    @IsString()
    type: string;
}
