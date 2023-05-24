import { ApiProperty } from '@nestjs/swagger';
import { FinanceType } from '@prisma/client';

export class Finance {
  @ApiProperty()
  id: number;

  @ApiProperty({ enum: FinanceType })
  type: FinanceType;

  @ApiProperty()
  description: string;

  @ApiProperty()
  value: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  userID: number;
}
