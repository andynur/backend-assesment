import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponse {
  @ApiProperty()
  public readonly max_page: number = 1;
  @ApiProperty() public readonly current: number;
  @ApiProperty() public readonly size: number;
  @ApiProperty() public readonly total: number;

  /**
   *
   */
  constructor(current: number, size: number, total: number) {
    this.current = current;
    this.size = size;
    this.total = total;
    if (total > size) {
      this.max_page = Math.ceil(total / size);
    }
  }
}

export class MetaFormattedResponseDto {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  response_time: number;
  @ApiProperty({ example: 200 })
  code: number;
  @ApiProperty({ example: 'ok' })
  message: string;
  @ApiProperty()
  pagination?: PaginationResponse;
}

export class FormattedResponseDto<T = any> {
  @ApiProperty()
  meta: MetaFormattedResponseDto;
  result?: T;
}
