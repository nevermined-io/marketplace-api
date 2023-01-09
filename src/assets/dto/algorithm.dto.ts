import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ContainerDto } from './container.dto'

export class AlgorithmDto {
  @ApiProperty({
    example: 'scala',
    description: 'Language used to implement the software',
    required: false,
  })
  @IsOptional()
  @IsString()
  language: string

  @ApiProperty({
    example: 'docker-image',
    description: 'Packaging format of the software',
    required: false,
  })
  @IsOptional()
  @IsString()
  format: string

  @ApiProperty({
    example: '0.1',
    description: 'Version of the software',
    required: false,
  })
  @IsOptional()
  @IsString()
  version: string

  @ApiProperty({
    type: [ContainerDto],
    description: 'Object describing the Docker container image',
  })
  @ValidateNested()
  @Type(() => ContainerDto)
  container: ContainerDto
}
