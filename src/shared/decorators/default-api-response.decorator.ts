import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { FormattedResponseDto } from '../dto';

export const DefaultApiResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  isArray = false,
  isString = false,
) =>
  applyDecorators(
    ApiExtraModels(FormattedResponseDto, dataDto),
    ApiResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(FormattedResponseDto) },
          {
            properties: {
              result: {
                type: isArray ? 'array' : isString ? 'string' : undefined,
                items: {
                  $ref: !isString ? getSchemaPath(dataDto) : undefined,
                },
              },
            },
          },
        ],
      },
    }),
  );
