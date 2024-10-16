import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { Identifier } from '@impactium/pattern'
import { CodeInvalidFormat, CodeNotProvided } from '@api/main/application/addon/error';
import { λthrow } from '@impactium/utils';

@Injectable()
export class CodeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {

    if (metadata.type !== 'param' || metadata.data !== 'code') λthrow(CodeNotProvided);

    if (!Identifier.test(value)) λthrow(CodeInvalidFormat);

    return value;
  }
}
