import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsDecimal } from 'class-validator';

export class CurationDto {
    @ApiProperty({
        example: 123,
        description: 'Total of votes that receive the asset',
    })
    @IsInt()
    numVotes: number;

    @ApiProperty({
        example: 0.93,
        description: 'Rating of the asset',
    })
    @IsDecimal()
    rating: number;

    @ApiProperty({
        example: 'Binary Voting',
        description: 'Schema of the asset',
    })
    @IsString()
    schema: string;
}