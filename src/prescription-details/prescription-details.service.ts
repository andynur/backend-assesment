import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrescriptionDetail } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { PriceConfigType } from 'src/products/dto/create-product.dto';
import { TAX_PERCENTAGE } from 'src/products/products.constants';
import { ProductsService } from 'src/products/products.service';
import { ErrorExist, ErrorNotFound } from 'src/shared/helpers/errors';
import { CreatePrescriptionDetailDto } from './dto/create-prescription-detail.dto';
import { UpdatePrescriptionDetailDto } from './dto/update-prescription-detail.dto';
import { PrescriptionDetailEntity } from './entities/prescription-detail.entity';
import {
  MODULE_NAME,
  PRESCRIPTION_ERRORS,
} from './prescription-details.constants';

@Injectable()
export class PrescriptionDetailsService {
  constructor(
    private prisma: PrismaService,
    private productService: ProductsService,
  ) {}

  logger = new Logger(PrescriptionDetailsService.name);

  private calculateFinalPrice(price: number, priceConfig: PriceConfigType) {
    const priceConfigAmount = this.productService.priceConfigAmount(
      price,
      priceConfig,
    );

    return TAX_PERCENTAGE * priceConfigAmount + priceConfigAmount;
  }

  async findUnique(
    prescriptionID: number,
    productID: number,
  ): Promise<Partial<PrescriptionDetail>> {
    return await this.prisma.prescriptionDetail.findFirst({
      select: {
        id: true,
      },
      where: { prescriptionID, productID },
    });
  }

  async create(
    input: CreatePrescriptionDetailDto,
  ): Promise<PrescriptionDetailEntity> {
    try {
      const detail = await this.findUnique(
        input.prescriptionID,
        input.productID,
      );
      if (detail != null) {
        throw ErrorExist(MODULE_NAME);
      }

      // validate total stock
      const product = await this.productService.findOne(input.productID);
      if (product.stock < input.qty) {
        throw new HttpException(
          PRESCRIPTION_ERRORS.INSUFFICIENT_EXCEPTION,
          HttpStatus.BAD_REQUEST,
        );
      }

      const finalPrice = this.calculateFinalPrice(
        input.originalPrice,
        input.priceConfig,
      );

      input.finalPrice = finalPrice;
      const prescriptionDetail = await this.prisma.prescriptionDetail.create({
        data: input,
      });

      const entity = new PrescriptionDetailEntity(prescriptionDetail);
      entity.totalProductPrice = finalPrice * input.qty;
      return entity;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async findOne(id: number): Promise<PrescriptionDetailEntity> {
    try {
      const prescriptionDetail =
        await this.prisma.prescriptionDetail.findFirstOrThrow({
          where: { id },
        });

      return new PrescriptionDetailEntity(prescriptionDetail);
    } catch (error) {
      this.logger.error(error);
      throw ErrorNotFound(MODULE_NAME);
    }
  }

  async update(
    id: number,
    input: UpdatePrescriptionDetailDto,
  ): Promise<PrescriptionDetailEntity> {
    try {
      const detail = await this.findUnique(
        input.prescriptionID,
        input.productID,
      );

      if (detail != null && detail.id != id) {
        throw ErrorExist(MODULE_NAME);
      }

      const finalPrice = this.calculateFinalPrice(
        input.originalPrice,
        input.priceConfig,
      );

      input.finalPrice = finalPrice;
      const prescriptionDetail = await this.prisma.prescriptionDetail.update({
        where: {
          id,
        },
        data: input,
      });

      const entity = new PrescriptionDetailEntity(prescriptionDetail);
      entity.totalProductPrice = finalPrice * input.qty;
      return entity;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async sumByPrescriptionId(prescriptionID: number) {
    try {
      const totalPrice = await this.prisma.prescriptionDetail
        .aggregate({
          where: {
            prescriptionID,
          },
          _sum: { finalPrice: true },
        })
        .then((result) => result._sum?.finalPrice ?? 0);

      return totalPrice;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(MODULE_NAME);
    }
  }
}
