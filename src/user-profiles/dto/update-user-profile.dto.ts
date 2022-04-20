import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsBoolean, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { State } from '../../common/type';
import { AdditionalInformation } from './additional-information.dto';

export class UpdateUserProfileDto {
  @ApiProperty({
    example: true,
    description: 'Flag identifying if the user is listed in the marketplace. Possible values: true or false',
  })
  @IsOptional()
  @IsBoolean()
  isListed: boolean;

  @ApiProperty({
    example: State.Confirmed,
    description: 'State of the user in the marketplace. Possible options: disabled, unconfirmed, confirmed',
  })
  @IsOptional()
  @IsEnum(State)
  state: State;

  @ApiProperty({
    example: ['0x37BB53e3d293494DE59fBe1FF78500423dcFd43B'],
    description: 'The list of the addressed owned by the user. Addresses cannot be shared between different users',
  })
  @IsOptional()
  @IsString({
    each: true,
  })
  addresses: string[];

  @ApiProperty({
    example: 'john.doe',
    description: 'The nickname of the user',
  })
  @IsOptional()
  @IsString()
  nickname: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: AdditionalInformation,
    description: 'List of additional key-value attributes with additional information',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AdditionalInformation)
  additionalInformation: AdditionalInformation;
}
