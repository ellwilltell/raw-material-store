import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DocumentationModule } from './documentation.module';
import { StoreModule } from '@store/store.module';

async function bootstrap() {
  const docModule = await NestFactory.create(DocumentationModule);
  const storeModule = await NestFactory.create(StoreModule);
  const config = new DocumentBuilder()
    .setTitle('RAW MATERIAL STORE')
    .setDescription('BUYING RAW STUFF')
    .setVersion('1.0')
    .addServer(
      `http://127.0.0.1:${process.env.STORE_SERVICE_PORT}`,
      'RAW MATERIAL STORE',
    )
    .build();
  const document = SwaggerModule.createDocument(storeModule, config);
  SwaggerModule.setup('/', docModule, document);
  await docModule.listen(process.env.DOCUMENTATION_SERVICE_PORT);
}

bootstrap();
