import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class GreetingDTO {
  static fromObject(user: {name: string, message: string}): GreetingDTO {
    return new GreetingDTO(user.name, user.message);
  }

  @ApiProperty({
    example: 'Pepe',
    description: 'The name of the user',
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: 'message',
    description: 'greeting message',
  })
  @IsString()
  readonly message: string;

  constructor(name: string, message: string) {
    this.name = name;
    this.message = message;
  }
}