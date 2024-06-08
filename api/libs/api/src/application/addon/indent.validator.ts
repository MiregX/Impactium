import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { Indent } from '@impactium/pattern'

@Injectable()
export class IndentValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {

    if (metadata.type !== 'param' || metadata.data !== 'indent') {
      throw new BadRequestException('indent_not_provided');
    }

    if (!Indent.test(value)) {
      throw new BadRequestException('indent_invalid_format');
    }

    return value;
  }
}
