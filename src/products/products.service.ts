import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { ErrorExist, ErrorNotFound } from 'src/shared/helpers/errors';
import { PaginationOptions } from 'src/shared/helpers/pagination';
import {
  Contains as queryContains,
  reduceQuery,
} from 'src/shared/helpers/query-helper';
import { CreateProductDto, PriceConfigType } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import {
  MARKUP_PERCENTAGE,
  MODULE_NAME,
  TAX_PERCENTAGE,
} from './products.types';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  logger = new Logger(ProductsService.name);

  private markupPrice(price: number): number {
    return MARKUP_PERCENTAGE * price + price;
  }

  private withTaxPrice(price: number): number {
    return TAX_PERCENTAGE * price + price;
  }

  private calculateTotalPrice(product: Product): number {
    let price = product.price;
    if (product.priceConfig === PriceConfigType.MarkupPrice) {
      price = this.markupPrice(product.price);
    }

    if (product.includingTaxes) {
      price = this.withTaxPrice(price);
    }

    return price;
  }

  private whereQuery(query: QueryProductDto) {
    const conditions = {
      name: queryContains(query.name),
      sku: queryContains(query.sku),
    };

    return reduceQuery(conditions);
  }

  async findAll(
    query: QueryProductDto,
    pagination: PaginationOptions,
  ): Promise<[Partial<ProductEntity>[], number]> {
    try {
      const skip = pagination.page * pagination.pageSize;
      const [products, total] = await Promise.all([
        this.prisma.product.findMany({
          ...this.whereQuery(query),
          skip: skip,
          take: pagination.pageSize,
          orderBy: pagination.order,
        }),
        this.prisma.product.count({ ...this.whereQuery(query) }),
      ]);

      const productEntities = products.map((product) => {
        const entity = new ProductEntity(product);
        entity.totalPrice = this.calculateTotalPrice(product);
        return entity;
      });

      return [productEntities, total];
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async findOne(id: number): Promise<ProductEntity> {
    try {
      const product = await this.prisma.product.findFirstOrThrow({
        where: { id },
      });

      const productEntity = new ProductEntity(product);
      productEntity.totalPrice = this.calculateTotalPrice(product);
      return productEntity;
    } catch (error) {
      this.logger.error(error);
      throw ErrorNotFound(MODULE_NAME);
    }
  }

  async findBySku(sku: string): Promise<Partial<Product>> {
    return await this.prisma.product.findFirst({
      select: {
        id: true,
        sku: true,
      },
      where: { sku },
    });
  }

  async create(input: CreateProductDto) {
    try {
      const product = await this.findBySku(input.sku);
      if (product != null) {
        throw ErrorExist(MODULE_NAME);
      }

      return this.prisma.product.create({
        data: input,
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async update(id: number, input: UpdateProductDto) {
    try {
      const product = await this.findBySku(input.sku);
      if (product != null && product.id != id) {
        throw ErrorExist(MODULE_NAME);
      }

      return await this.prisma.product.update({
        where: {
          id: id,
        },
        data: input,
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async remove(id: number) {
    try {
      const product = await this.findOne(id);
      if (product != null) {
        throw ErrorNotFound(MODULE_NAME);
      }

      return await this.prisma.product.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }
}
