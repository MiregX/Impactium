import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { ApiModule } from './api.module';
import * as cookieParser from 'cookie-parser';
import { Configuration } from '@impactium/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';
import { MicroserviceOptions } from '@nestjs/microservices';
import { MainModule } from '@api/main/main/main.module';

async function run() {
  const api = await NestFactory.create<NestExpressApplication>(
    ApiModule,
    new ExpressAdapter(),
  );

  const analytics = await NestFactory.createMicroservice<MicroserviceOptions>(MainModule, {
    transport: Transport.GRPC,
    options: {
      package: 'analytics',
      protoPath: '../controller.proto',
    },
  });
  
  await analytics.listen();

  // api.setGlobalPrefix('api');

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
