import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { Identifier } from '@impactium/pattern'
import { IndentNotProvided } from '@api/main/application/addon/error';
import { λthrow } from '@impactium/utils';
import { IndentInvalidFormat } from '@api/main/application/addon/error';

@Injectable()
export class IndentValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {

    if (metadata.type !== 'param' || metadata.data !== 'indent') λthrow(IndentNotProvided);

    if (!Identifier.test(value)) λthrow(IndentInvalidFormat);

    return value;
  }
}
