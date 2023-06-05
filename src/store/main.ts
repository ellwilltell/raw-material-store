import { NestFactory } from '@nestjs/core';
import { StoreModule } from './store.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(StoreModule);
  app.enableShutdownHooks();
  app.enableCors({
    origin: `http://127.0.0.1:${process.env.DOCUMENTATION_SERVICE_PORT}`,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(process.env.STORE_SERVICE_PORT);
}
bootstrap();
