import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateBookmarkDto {
    @ApiProperty({
        example: 'I am interesting in this asset',
        description: 'Description given by the user'
    })
    @IsOptional()
    @IsString()
    description: string;
}