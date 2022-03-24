import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ContainerDto {
  @ApiProperty({
    example: 'node $ALGO',
    description: 'The command to execute, or script to run inside the Docker image',
  })
  @IsOptional()
  @IsString()
  entrypoint: string;

  @ApiProperty({
    example: 'node',
    description: 'Name of the Docker image',
  })
  @IsOptional()
  @IsString()
  image: string;

  @ApiProperty({
    example: '10',
    description: 'Tag of the Docker image',
  })
  @IsOptional()
  @IsString()
  tag: string;
}
