import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsUrl } from 'class-validator';

export class AuthorizationDto {
    @ApiProperty({
        example: 0,
        description: 'index of the service',
    })
    @IsInt()
    index: number;

    @ApiProperty({
        example: 'SecretStore',
        description: 'Service name',
    })
    @IsString()
    service: string;

    @ApiProperty({
        example: 'http://localhost:12001',
        description: 'Url of the service endpoint',
    })
    @IsUrl()
    serviceEndpoint: string;

    @ApiProperty({
        example: 'authorization',
        description: 'Service type',
    })
    @IsString()
    type: string;
}
