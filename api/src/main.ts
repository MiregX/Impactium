import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ApiModule } from './api.module';

async function run() {
  const api = await NestFactory.create<NestFastifyApplication>(
    ApiModule,
    new FastifyAdapter(),
  );

  api.setGlobalPrefix('api');
  api.listen(process.env.API_PORT, '0.0.0.0');
  console.log(process.env.API_PORT);
}
run();
