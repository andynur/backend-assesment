import { ApiProperty } from '@nestjs/swagger';
import { Prescription, PrescriptionStatusType } from '@prisma/client';
import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreatePrescriptionDto implements Prescription {
  @IsEmpty()
  id: number;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;

  @IsEmpty()
  userID: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  patientName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clinicName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  doctorName: string;

  @IsEmpty()
  totalPrice: number;

  @IsEmpty()
  status: PrescriptionStatusType;
}
