import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { ApiModule } from './api.module';
import * as cookieParser from 'cookie-parser';
import { Configuration } from '@impactium/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function run() {
  const api = await NestFactory.create<NestExpressApplication>(
    ApiModule,
    new ExpressAdapter(),
  );

  api.setGlobalPrefix('api');

  api.enableCors({
    origin: Configuration.getClientLink() || 'http://localhost:3001',
    credentials: true
  });

  api.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true
  }));

  api.use(cookieParser(process.env.JWT_SECRET));

  SwaggerModule.setup('api', api, SwaggerModule.createDocument(api, new DocumentBuilder()
    .setTitle('API | Impactium')
    .build()
  ));

  api.listen(process.env.API_PORT || 3001, '0.0.0.0');
}

run();
