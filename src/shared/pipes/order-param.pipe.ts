import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class OrderParamPipe implements PipeTransform {
  /**
   *
   */
  constructor(private readonly availableOptions: string[]) {}
  transform(value: any, metadata: ArgumentMetadata) {
    if (value === undefined) return;

    if (!this.availableOptions.includes(value)) {
      throw new BadRequestException(
        `parameter ${metadata.data} with value ${value} has not valid`,
      );
    }

    return value;
  }
}
