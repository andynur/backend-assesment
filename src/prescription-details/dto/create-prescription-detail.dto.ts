import { ApiProperty } from '@nestjs/swagger';
import { PrescriptionDetail } from '@prisma/client';
import {
  IsBoolean,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { PriceConfigType } from 'src/products/dto/create-product.dto';

export class CreatePrescriptionDetailDto implements PrescriptionDetail {
  @IsEmpty()
  id: number;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;

  @IsEmpty()
  finalPrice: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  prescriptionID: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  productID: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  qty: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  originalPrice: number;

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
