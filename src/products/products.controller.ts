import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
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
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiQuery(PageApiQueryOptions())
  @ApiQuery(PageSizeApiQueryOptions())
  @ApiQuery(OrderByApiQueryOptions())
  @ApiQuery(OrderRuleApiQueryOptions(['id', 'name', 'sku']))
  @UseInterceptors(ClassSerializerInterceptor)
  @DefaultApiResponse(ProductEntity, true)
  @UsePipes(ValidationPipe)
  @Get()
  async findAll(
    @Query() query: QueryProductDto,
    @Query('page', PagePipe) page: number,
    @Query('page_size', PageSizePipe) pageSize: number,
    @Query('or', new OrderParamPipe(['id', 'name', 'sku'])) or = 'id',
    @Query('ob') ob: 'asc' | 'desc' = 'asc',
  ): Promise<ResponseController<Array<Partial<ProductEntity>>>> {
    const pagination = PaginationQuery(page, pageSize, or, ob);
    const [rows, total] = await this.productsService.findAll(query, pagination);

    return {
      data: rows,
      paginationMeta: new PaginationResponse(1 + page, pageSize, total),
    };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @DefaultApiResponse(ProductEntity, false, false)
  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productsService.findOne(id);
    return { data: product };
  }

  @Post('/')
  @DefaultApiResponse(String, false, true)
  async create(
    @Body(ValidationPipe()) input: CreateProductDto,
  ): Promise<ResponseController> {
    await this.productsService.create(input);
    return { data: 'data created' };
  }

  @Patch('/:id')
  @DefaultApiResponse(String, false, true)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe()) input: UpdateProductDto,
  ): Promise<ResponseController> {
    await this.productsService.update(id, input);
    return {
      data: 'data updated',
    };
  }

  @DefaultApiResponse(String, false, true)
  @Delete('/:id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseController> {
    await this.productsService.remove(id);
    return { data: 'data deleted' };
  }
}
