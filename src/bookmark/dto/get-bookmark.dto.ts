import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate } from 'class-validator';

export class GetBookmarkDto {
    @ApiProperty({
        example: 'b-123434',
        description: 'The identifier of the bookmark'
    })
    @IsString()
    id: string;

    @ApiProperty({
        example: 'did:12345',
        description: 'The identifier of the asset'
    })
    @IsString()
    did: string;

    @ApiProperty({
        example: 'u-12345',
        description: 'The userId who created the bookmark'
    })
    @IsString()
    userId: string;

    @ApiProperty({
        example: 'I am interesting in this asset',
        description: 'Description given by the user'
    })
    @IsString()
    description: string;

    @ApiProperty({
        example: new Date(),
        description: 'When the UGC was created'
    })
    @IsDate()
    createdAt: Date;
}