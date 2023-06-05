import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { SupplierModule } from './supplier.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SupplierModule,
    SupplierModule.ProvideServerConfiguration('supply'),
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen();
}
export default bootstrap();
