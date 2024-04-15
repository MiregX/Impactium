import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { MainModule } from '@api/main';
import fastifyCookie from '@fastify/cookie';
import { Configuration } from '@impactium/config';

async function run() {
  const api = await NestFactory.create<NestFastifyApplication>(
    MainModule,
    new FastifyAdapter(),
  );

  api.setGlobalPrefix('api');
  api.enableCors({
    origin: Configuration.getClientLink(),
    credentials: true
  });
  await api.register(fastifyCookie, {
    secret: process.env.JWT_SECRET,
  });
  api.listen(process.env.API_PORT, '0.0.0.0');
}
run();