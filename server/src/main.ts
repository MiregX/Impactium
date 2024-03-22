import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';
import path = require('path');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const next = require('next');
async function run() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  
  const nextApp = next({
    dev: true,
    dir: path.resolve(__dirname, '..\\..\\client')
  });
  const handle = nextApp.getRequestHandler();
  await nextApp.prepare();

  app.use((request: Request, response: Response, next: NextFunction) => {
    if (!request.url.startsWith('/api'))
      return handle(request, response);
    else
      next();
  });

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 3000);
}
run();
