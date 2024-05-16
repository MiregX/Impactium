import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class IndentValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const validPattern = /^(?!.*[-_]{2,})[a-z0-9][-a-z0-9_]{1,22}[a-z0-9]$/i;

    if (metadata.type !== 'param' || metadata.data !== 'indent') {
      throw new BadRequestException('Indent didn\'t provided');
    }

    if (!validPattern.test(value)) {
      throw new BadRequestException('Invalid indent format');
    }

    return value;
  }
}
