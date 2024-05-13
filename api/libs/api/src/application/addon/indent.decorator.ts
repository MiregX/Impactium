import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class IndentValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const validPattern = /^(?!.*[-_]{2,})[0-9a-z_-]{3,24}$/;

    if (metadata.type !== 'param' || metadata.data !== 'indent') {
      return value;
    }

    if (!validPattern.test(value)) {
      throw new BadRequestException('Invalid indent format');
    }

    return value;
  }
}
