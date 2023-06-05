import { Module } from '@nestjs/common';
import { NestApplicationContextOptions } from '@nestjs/common/interfaces/nest-application-context-options.interface';
import {
  ClientsModuleOptions,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { SupplierItem, SupplierItemSchema } from './supplier-item.model';
import { SupplierItemService } from './supplier-item.service';
import { SupplierController } from './supplier.controller';
import { Supplier, SupplierSchema } from './supplier.model';
import { SupplierService } from './supplier.service';
export const RABBITMQ_URI = `amqp://\
${process.env.RABBITMQ_SERVICE_USERNAME}:\
${process.env.RABBITMQ_SERVICE_PASSWORD}@\
${process.env.RABBITMQ_SERVICE_URL}:\
${process.env.RABBITMQ_SERVICE_PORT}`;

const MONGO_URI = `mongodb://\
${process.env.MONGODB_SERVICE_USERNAME}:\
${process.env.MONGODB_SERVICE_PASSWORD}@\
${process.env.MONGODB_SERVICE_URL}:\
${process.env.MONGODB_SERVICE_PORT}/\
${process.env.MONGODB_SERVICE_DBNAME}?authSource=admin`;

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_URI),
    MongooseModule.forFeature([
      { name: Supplier.name, schema: SupplierSchema },
      { name: SupplierItem.name, schema: SupplierItemSchema },
    ]),
  ],
  providers: [SupplierService, SupplierItemService],
  controllers: [SupplierController],
  exports: [SupplierService],
})
export class SupplierModule {
  static ProvideClientConfiguration(queueName: string): ClientsModuleOptions {
    return [
      {
        name: Supplier.name,
        transport: Transport.RMQ,
        options: {
          urls: [RABBITMQ_URI],
          queue: `${queueName.toLowerCase()}_queue`,
          queueOptions: {
            durable: false,
          },
        },
      },
    ];
  }

  static ProvideServerConfiguration(
    queueName: string,
  ): NestApplicationContextOptions & MicroserviceOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [RABBITMQ_URI],
        queue: `${queueName.toLowerCase()}_queue`,
        queueOptions: { durable: false },
        prefetchCount: 1,
      },
    };
  }
}
