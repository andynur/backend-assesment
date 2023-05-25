import { ApiProperty } from '@nestjs/swagger';
import { PrescriptionDetail } from '@prisma/client';
import { Expose } from 'class-transformer';
import { PriceConfigType } from 'src/products/dto/create-product.dto';

export class PrescriptionDetailEntity implements PrescriptionDetail {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  prescriptionID: number;

  @Expose()
  @ApiProperty()
  productID: number;

  @Expose()
  @ApiProperty()
  qty: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  originalPrice: number;

  @Expose()
  @ApiProperty()
  priceConfig: PriceConfigType;

  @Expose()
  @ApiProperty()
  priceConfigLabel: string;

  @Expose()
  @ApiProperty()
  includingTaxes: boolean;

  @Expose()
  @ApiProperty()
  updatedAt: Date;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  finalPrice: number;

  @Expose()
  @ApiProperty()
  totalProductPrice: number;

  constructor(partial: Partial<PrescriptionDetail>) {
    Object.assign(this, partial);
  }
}
