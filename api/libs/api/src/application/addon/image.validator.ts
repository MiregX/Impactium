import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileExtension } from '@impactium/pattern';
import { UnallowedFileFormat } from './error';

export function ImageValidator(field: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    UseInterceptors(
      FileInterceptor(field, {
        limits: { fileSize: 1024 * 1024 },
        fileFilter: (_req, file, callback) => {
          if (!FileExtension.test(file.originalname))
            return callback(new UnallowedFileFormat(), false);

          callback(null, true);
        },
      })
    )(target, propertyKey, descriptor);
  };
}
