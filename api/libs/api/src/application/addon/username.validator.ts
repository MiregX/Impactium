import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { Identifier } from '@impactium/pattern'
import { UsernameInvalidFormat, UsernameNotProvided } from './error';

@Injectable()
export class UsernameValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {

    if (metadata.type !== 'param' || metadata.data !== 'username') {
      throw new UsernameNotProvided;
    }

    if (!Identifier.test(value)) {
      throw new UsernameInvalidFormat;
    }

    return value;
  }
}
