import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsUrl, ValidateNested } from 'class-validator';
import { AditionalInformationDto } from './aditionalInformation.dto';
import { CurationDto } from './curation.dto';
import { MainDto } from './main.dto';

export class AttributesDto {
    @ApiProperty({
        example: AditionalInformationDto,
        description: 'Aditional information of the asset',
    })
    @ValidateNested()
    additionalInformation: AditionalInformationDto;

    @ApiProperty({
        example: CurationDto,
        description: 'popularity of the asset',
    })
    @ValidateNested()
    curation: CurationDto;

    @ApiProperty({
        example: MainDto,
        description: 'Main data of the asset',
    })
    @ValidateNested()
    main: MainDto;

    @ApiProperty({
        example: 2,
        description: 'Index of the attribute',
    })
    @IsInt()
    index: number;

    @ApiProperty({
        example: 'http://mymetadata.org/api/v1/provider/assets/ ' + 
            'metadata/did:nv:0c184915b07b44c888d468be85a9b28253e80070e5294b1aaed81c2f0264e430',
        description: 'Endpoint to retrieve the asset',
    })
    @IsUrl()
    serviceEndpoint: string;

    @ApiProperty({
        example: 'metadata',
        description: 'Asset Type',
    })
    @IsString()
    type: string;
}