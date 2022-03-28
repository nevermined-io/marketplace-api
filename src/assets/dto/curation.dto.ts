import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNumber, Max, Min, IsOptional, IsBoolean } from 'class-validator';

export class CurationDto {
  @ApiProperty({
    example: 123,
    description: 'Number of votes. 0 is the default value',
  })
  @IsInt()
  numVotes: number;

  @ApiProperty({
    example: 0.93,
    description: 'Decimal value between 0 and 1. 0 is the default value',
  })
  @IsNumber()
  @Max(1)
  @Min(0)
  rating: number;

  @ApiProperty({
    example: 'Binary Voting',
    description: 'Schema applied to calculate the rating',
    required: false,
  })
  @IsOptional()
  @IsString()
  schema: string;

  @ApiProperty({
    example: false,
    description: "Flag unsuitable content. False by default. If it's true, the content must not be returned",
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isListed: boolean;
}
