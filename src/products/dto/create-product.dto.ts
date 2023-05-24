import { ApiProperty } from '@nestjs/swagger';
import { Product } from '@prisma/client';
import {
  IsBoolean,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export enum PriceConfigType {
  MarkupPrice = 1,
  FixedPrice = 2,
}

export class CreateProductDto implements Product {
  @IsEmpty()
  id: number;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @ApiProperty({
    enum: [1, 2],
  })
  @IsEnum(PriceConfigType)
  @IsNotEmpty()
  priceConfig: PriceConfigType;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  includingTaxes: boolean;
}
