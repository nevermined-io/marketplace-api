import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ConditionDependencyDto } from './conditionDependency.dto';
import { ConditionDto } from './conditions.dto';
import { EventDto } from './event.dto';

export class ServiceAgreementTemplateDto {
  @ApiProperty({
    type: [ConditionDependencyDto],
    description: '',
  })
  @ValidateNested()
  @Type(() => ConditionDependencyDto)
  conditionDependency: ConditionDependencyDto;

  @ApiProperty({
    type: [ConditionDto],
    description: 'Conditions',
  })
  @ValidateNested({ each: true })
  @Type(() => ConditionDto)
  conditions: ConditionDto[];

  @ApiProperty({
    example: 'EscrowAccessSecretStoreTemplate',
    description: 'Contract Name',
  })
  @IsString()
  contractName: number;

  @ApiProperty({
    type: [EventDto],
    description: 'Events',
  })
  @ValidateNested({ each: true })
  @Type(() => EventDto)
  events: EventDto[];

  @ApiProperty({
    example: ['lockPayment.fulfill', 'access.fulfill', 'escrowPayment.fulfill'],
    description: 'Fulfillment order',
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  fulfillmentOrder: string;
}
