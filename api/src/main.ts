import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ApiModule } from './api.module';
import fastifyCookie from '@fastify/cookie';
import { Configuration } from '@impactium/config';
import { ValidationPipe } from '@nestjs/common';

async function run() {
  const api = await NestFactory.create<NestFastifyApplication>(
    ApiModule,
    new FastifyAdapter(),
  );

  api.setGlobalPrefix('api');
  api.enableCors({
    origin: Configuration.getClientLink() || 'http://localhost:3001',
    credentials: true
  });
  api.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true
  }))
  await api.register(fastifyCookie, {
    secret: process.env.JWT_SECRET,
  });
  api.listen(process.env.API_PORT || 3001, '0.0.0.0');
}
run();