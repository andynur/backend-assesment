import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PagePipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, _: ArgumentMetadata) {
    if (value) {
      try {
        const page = parseInt(value, 10);
        if (page > 1) {
          return page - 1;
        }
      } catch (error) {}
    }
    return 0;
  }
}
