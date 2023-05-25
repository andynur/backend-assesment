import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class QueryPrescriptionDto {
  @ApiProperty({
    required: false,
    name: 'patientName',
    description: 'patient name',
  })
  @IsOptional()
  patientName: string;

  @ApiProperty({
    required: false,
    name: 'userID',
    description: 'user id',
  })
  @IsOptional()
  userID: number;
}
