import { ApiProperty } from '@nestjs/swagger';
import { IsUrl, IsOptional } from 'class-validator';

export class AdditionalInformation {
  @ApiProperty({
    example: 'http://example.com/avatar.jpg',
    description: 'Profile image url',
  })
  @IsOptional()
  @IsUrl({
    require_tld: false,
  })
  profilePicture: string;

  @ApiProperty({
    example: 'http://linkedin.com',
    description: 'User Linkedin profile url',
  })
  @IsOptional()
  @IsUrl({
    require_tld: false,
  })
  linkedinProfile: string;
}
