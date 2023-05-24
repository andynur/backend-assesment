import { ApiProperty } from '@nestjs/swagger';
import { Product } from '@prisma/client';
import { Expose } from 'class-transformer';
import { PriceConfigType } from '../dto/create-product.dto';

export class ProductEntity implements Product {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  sku: string;

  @Expose()
  @ApiProperty()
  price: number;

  @Expose()
  @ApiProperty()
  stock: number;

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
  totalPrice: number;

  @Expose()
  @ApiProperty()
  updatedAt: Date;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
  }
}
