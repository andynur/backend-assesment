import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Prescription, PrescriptionStatusType } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { AuthService } from 'src/auth/auth.service';
import { PRESCRIPTION_ERRORS } from 'src/prescription-details/prescription-details.constants';
import { PrescriptionDetailsService } from 'src/prescription-details/prescription-details.service';
import { ProductsService } from 'src/products/products.service';
import { ErrorNotFound } from 'src/shared/helpers/errors';
import { PaginationOptions } from 'src/shared/helpers/pagination';
import {
  Contains as queryContains,
  queryIfNotEmpty,
  reduceQuery,
} from 'src/shared/helpers/query-helper';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { QueryPrescriptionDto } from './dto/query-prescription.dto';
import { PrescriptionEntity } from './entities/prescription.entity';
import { MODULE_NAME } from './prescriptions.constants';

@Injectable()
export class PrescriptionsService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
    private productSerivce: ProductsService,
    private prescriptionDetailsService: PrescriptionDetailsService,
  ) {}

  logger = new Logger(PrescriptionsService.name);

  private whereQuery(query: QueryPrescriptionDto) {
    const conditions = {
      patientName: queryContains(query.patientName),
      userID: queryIfNotEmpty(query.userID),
    };

    return reduceQuery(conditions);
  }

  async findAll(
    query: QueryPrescriptionDto,
    pagination: PaginationOptions,
  ): Promise<[Partial<PrescriptionEntity>[], number]> {
    try {
      const skip = pagination.page * pagination.pageSize;
      const [prescriptions, total] = await Promise.all([
        this.prisma.prescription.findMany({
          ...this.whereQuery(query),
          include: {
            PrescriptionDetails: true,
          },
          skip: skip,
          take: pagination.pageSize,
          orderBy: pagination.order,
        }),
        this.prisma.prescription.count({ ...this.whereQuery(query) }),
      ]);

      const prescriptionEntities = prescriptions.map(
        (prescription) => new PrescriptionEntity(prescription),
      );

      return [prescriptionEntities, total];
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async findOne(id: number): Promise<PrescriptionEntity> {
    try {
      const prescription = await this.prisma.prescription.findFirstOrThrow({
        where: { id },
        include: {
          PrescriptionDetails: true,
        },
      });

      return new PrescriptionEntity(prescription);
    } catch (error) {
      this.logger.error(error);
      throw ErrorNotFound(MODULE_NAME);
    }
  }

  async create(
    input: CreatePrescriptionDto,
    userEmail: string,
  ): Promise<PrescriptionEntity> {
    try {
      const user = await this.authService.whoIAm(userEmail);
      input.userID = user.id;

      const prescription = await this.prisma.prescription.create({
        data: input,
      });

      return new PrescriptionEntity(prescription);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async updateStatus(
    id: number,
    status: PrescriptionStatusType,
  ): Promise<Prescription> {
    try {
      const prescription = await this.findOne(id);
      // return on same status
      if (prescription.status == status) {
        return prescription;
      }

      // error on done
      if (prescription.status != PrescriptionStatusType.Created) {
        throw new HttpException(
          PRESCRIPTION_ERRORS.ALREADY_DONE,
          HttpStatus.BAD_REQUEST,
        );
      }

      const totalPrice =
        await this.prescriptionDetailsService.sumByPrescriptionId(id);

      // adjust product stock
      if (status === PrescriptionStatusType.Confirmed) {
        prescription.PrescriptionDetails.forEach((prescriptionDetail) => {
          this.productSerivce.increaseStock(
            prescriptionDetail.productID,
            prescriptionDetail.qty,
          );
        });
      } else if (status === PrescriptionStatusType.Cancelled) {
        prescription.PrescriptionDetails.forEach((prescriptionDetail) => {
          this.productSerivce.decreaseStock(
            prescriptionDetail.productID,
            prescriptionDetail.qty,
          );
        });
      }

      // update parent data
      return await this.prisma.prescription.update({
        where: { id },
        data: {
          status: status,
          totalPrice: totalPrice,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async checkout(id: number): Promise<PrescriptionEntity> {
    const prescription = await this.updateStatus(
      id,
      PrescriptionStatusType.Confirmed,
    );

    return new PrescriptionEntity(prescription);
  }

  async cancel(id: number): Promise<PrescriptionEntity> {
    const prescription = await this.updateStatus(
      id,
      PrescriptionStatusType.Cancelled,
    );

    return new PrescriptionEntity(prescription);
  }
}
