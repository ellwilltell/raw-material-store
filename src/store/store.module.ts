import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { ClientsModule } from '@nestjs/microservices';
import { SupplierModule } from 'src/supplier/supplier.module';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreItem, StoreItemSchema } from './store-item.model';

const MONGO_URI = `mongodb://\
${process.env.MONGODB_SERVICE_USERNAME}:\
${process.env.MONGODB_SERVICE_PASSWORD}@\
${process.env.MONGODB_SERVICE_URL}:\
${process.env.MONGODB_SERVICE_PORT}/\
${process.env.MONGODB_SERVICE_DBNAME}?authSource=admin`;

@Module({
  imports: [
    SupplierModule,
    MongooseModule.forRoot(MONGO_URI),
    ClientsModule.register(SupplierModule.ProvideClientConfiguration('supply')),
    MongooseModule.forFeature([
      { name: StoreItem.name, schema: StoreItemSchema },
    ]),
  ],
  providers: [StoreService],
  controllers: [StoreController],
})
export class StoreModule {}
