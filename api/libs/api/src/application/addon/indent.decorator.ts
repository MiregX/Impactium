import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class IndentValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const validPattern = /^(?!.*[-_]{2,})[0-9a-z_-]{3,24}$/; // Ваше регулярное выражение для проверки параметра indent

    if (metadata.type !== 'param' || metadata.data !== 'indent') {
      return value; // Пропускаем валидацию, если это не параметр 'indent'
    }

    if (!validPattern.test(value)) {
      throw new BadRequestException('Invalid indent format'); // Бросаем исключение, если параметр не соответствует шаблону
    }

    return value; // Возвращаем значение, если оно прошло валидацию
  }
}
