import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Session as GetSession,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ApiCookieAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Session } from 'express-session';
import { DefaultApiResponse } from 'src/shared/decorators/default-api-response.decorator';
import { PaginationResponse } from 'src/shared/dto';
import {
  OrderByApiQueryOptions,
  OrderRuleApiQueryOptions,
  PageApiQueryOptions,
  PageSizeApiQueryOptions,
} from 'src/shared/helpers/docs';
import { PaginationQuery } from 'src/shared/helpers/pagination';
import { OrderParamPipe } from 'src/shared/pipes/order-param.pipe';
import { PageSizePipe } from 'src/shared/pipes/page-size.pipe';
import { PagePipe } from 'src/shared/pipes/page.pipe';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { ResponseController } from 'src/shared/types';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { QueryPrescriptionDto } from './dto/query-prescription.dto';
import { PrescriptionEntity } from './entities/prescription.entity';
import { ORDER_RULE } from './prescriptions.constants';
import { PrescriptionsService } from './prescriptions.service';

@ApiTags('prescriptions')
@ApiCookieAuth()
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @ApiQuery(PageApiQueryOptions())
  @ApiQuery(PageSizeApiQueryOptions())
  @ApiQuery(OrderByApiQueryOptions())
  @ApiQuery(OrderRuleApiQueryOptions(ORDER_RULE))
  @UseInterceptors(ClassSerializerInterceptor)
  @DefaultApiResponse(PrescriptionEntity, true)
  @UsePipes(ValidationPipe)
  @Get()
  async findAll(
    @Query() query: QueryPrescriptionDto,
    @Query('page', PagePipe) page: number,
    @Query('page_size', PageSizePipe) pageSize: number,
    @Query('or', new OrderParamPipe(ORDER_RULE)) or = 'id',
    @Query('ob') ob: 'asc' | 'desc' = 'asc',
  ): Promise<ResponseController<Array<Partial<PrescriptionEntity>>>> {
    const pagination = PaginationQuery(page, pageSize, or, ob);
    const [rows, total] = await this.prescriptionsService.findAll(
      query,
      pagination,
    );

    return {
      data: rows,
      paginationMeta: new PaginationResponse(1 + page, pageSize, total),
    };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @DefaultApiResponse(PrescriptionEntity, false, false)
  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const prescription = await this.prescriptionsService.findOne(id);
    return { data: prescription };
  }

  @Post('/')
  @DefaultApiResponse(PrescriptionEntity, false, true)
  async create(
    @Body(ValidationPipe()) input: CreatePrescriptionDto,
    @GetSession() session: Session,
  ): Promise<ResponseController> {
    const prescription = await this.prescriptionsService.create(
      input,
      session.user.email,
    );

    return { data: prescription };
  }

  @Patch(':id/checkout')
  @DefaultApiResponse(PrescriptionEntity, false, true)
  async checkout(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseController> {
    const prescription = await this.prescriptionsService.checkout(id);

    return {
      data: prescription,
    };
  }

  @Patch(':id/cancel')
  @DefaultApiResponse(PrescriptionEntity, false, true)
  async cancel(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseController> {
    const prescription = await this.prescriptionsService.cancel(id);

    return {
      data: prescription,
    };
  }
}
