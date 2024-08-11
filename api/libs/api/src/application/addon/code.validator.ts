import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { Identifier } from '@impactium/pattern'
import { CodeInvalidFormat, CodeNotProvided } from './error';

@Injectable()
export class CodeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {

    if (metadata.type !== 'param' || metadata.data !== 'code') {
      throw new CodeNotProvided;
    }

    if (!Identifier.test(value)) {
      throw new CodeInvalidFormat;
    }

    return value;
  }
}
