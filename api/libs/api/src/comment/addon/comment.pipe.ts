import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { CommentTypeDto } from './comment.dto';

@Injectable()
export class CommentTypeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const types: CommentTypeDto[] = ['team']

    if (metadata.type !== 'param' || metadata.data !== 'type') {
      throw new BadRequestException('type_not_recognized');
    }

    if (!types.includes(value)) {
      throw new BadRequestException('type_invalid');
    }

    return value;
  }
}
