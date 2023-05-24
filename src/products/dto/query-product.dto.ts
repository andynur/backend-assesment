import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class QueryProductDto {
  @ApiProperty({
    required: false,
    name: 'name',
    description: 'product name',
  })
  @IsOptional()
  name: string;

  @ApiProperty({
    required: false,
    name: 'sku',
    description: 'product sku',
  })
  @IsOptional()
  sku: string;
}
