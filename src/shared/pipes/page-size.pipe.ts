import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PageSizePipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, _: ArgumentMetadata) {
    if (value) {
      try {
        const page = parseInt(value, 10);
        if (page > 1) {
          return page;
        }
      } catch (error) {}
    }

    return 15;
  }
}
