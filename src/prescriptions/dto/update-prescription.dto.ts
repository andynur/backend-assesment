import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreatePrescriptionDto } from './create-prescription.dto';

export class UpdatePrescriptionDto extends PartialType(CreatePrescriptionDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  doctorName: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;
}
