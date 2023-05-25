import { ApiProperty } from '@nestjs/swagger';
import {
  Prescription,
  PrescriptionDetail,
  PrescriptionStatusType,
} from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class PrescriptionEntity implements Prescription {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  userID: number;

  @Expose()
  @ApiProperty()
  patientName: string;

  @Expose()
  @ApiProperty()
  clinicName: string;

  @Expose()
  @ApiProperty()
  doctorName: string;

  @Expose()
  @ApiProperty()
  totalPrice: number;

  @Expose()
  @ApiProperty({ enum: PrescriptionStatusType })
  status: PrescriptionStatusType;

  @Exclude()
  PrescriptionDetails: PrescriptionDetail[];

  @Expose()
  @ApiProperty()
  get details(): PrescriptionDetail[] {
    return this.PrescriptionDetails;
  }

  @Expose()
  @ApiProperty()
  updatedAt: Date;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  constructor(partial: Partial<Prescription>) {
    Object.assign(this, partial);
  }
}
