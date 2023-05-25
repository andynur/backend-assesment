import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { DefaultApiResponse } from 'src/shared/decorators/default-api-response.decorator';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { ResponseController } from 'src/shared/types';
import { CreatePrescriptionDetailDto } from './dto/create-prescription-detail.dto';
import { UpdatePrescriptionDetailDto } from './dto/update-prescription-detail.dto';
import { PrescriptionDetailEntity } from './entities/prescription-detail.entity';
import { PrescriptionDetailsService } from './prescription-details.service';

@ApiTags('prescription-details')
@ApiCookieAuth()
@Controller('prescription-details')
export class PrescriptionDetailsController {
  constructor(
    private readonly prescriptionDetailsService: PrescriptionDetailsService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @DefaultApiResponse(PrescriptionDetailEntity, false, false)
  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const prescriptionDetail = await this.prescriptionDetailsService.findOne(
      id,
    );
    return { data: prescriptionDetail };
  }

  @Post('/')
  @DefaultApiResponse(String, false, true)
  async create(
    @Body(ValidationPipe()) input: CreatePrescriptionDetailDto,
  ): Promise<ResponseController> {
    const prescriptionDetail = await this.prescriptionDetailsService.create(
      input,
    );

    return { data: prescriptionDetail };
  }

  @Patch('/:id')
  @DefaultApiResponse(String, false, true)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe()) input: UpdatePrescriptionDetailDto,
  ): Promise<ResponseController> {
    const prescriptionDetail = await this.prescriptionDetailsService.update(
      id,
      input,
    );

    return {
      data: prescriptionDetail,
    };
  }
}
