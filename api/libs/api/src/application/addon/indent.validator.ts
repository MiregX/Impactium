import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { Identifier } from '@impactium/pattern'
import { IndentInvalidFormat, IndentNotProvided } from './error';

@Injectable()
export class IndentValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {

    if (metadata.type !== 'param' || metadata.data !== 'indent') {
      throw new IndentNotProvided;
    }

    if (!Identifier.test(value)) {
      throw new IndentInvalidFormat;
    }

    return value;
  }
}
