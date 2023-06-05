import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from '@shared/category/category.enum';
import { ANIMAL_ORIGINS } from '@shared/seed/animal-origins';
import { MINING_ORIGINS } from '@shared/seed/mining-origins';
import { PLANT_ORIGINS } from '@shared/seed/plant-origins';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { SupplierResult } from 'src/supplier/dto/supplier-result';
import { Supplier } from 'src/supplier/supplier.model';
import { SupplierService } from 'src/supplier/supplier.service';
import { UpdateItemStock } from './dto/req.update-item-stock';
import { ResStoreItem, ResStoreList } from './dto/res.store.list';
import { StoreItem, StoreItemDocument } from './store-item.model';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(StoreItem.name)
    private readonly StoreItemModel: Model<StoreItemDocument>,
    @Inject(Supplier.name) private client: ClientProxy,
    private readonly supplierService: SupplierService,
  ) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async onApplicationShutdown() {
    await this.client.close();
  }

  async getSToreItems(): Promise<ResStoreList> {
    const storeItems = await this.StoreItemModel.find().transform((items) =>
      this.transformItems(items),
    );
    return this.getWithSupplierItems(storeItems);
  }

  async getWithSupplierItems(storeItems) {
    const cloned = [...storeItems];
    for (let i = 0; i < storeItems.length; i++) {
      const storeItem = storeItems[i];
      cloned[i].suppliers = await this.getSupplierItems(
        storeItem.name,
        storeItem.category,
      );
    }
    return cloned;
  }

  async getSupplierItems(
    name: string,
    category: Category,
  ): Promise<SupplierResult[]> {
    const data = new RmqRecordBuilder({
      name,
      category,
    });
    const result = await firstValueFrom(
      this.client.send<SupplierResult[], any>('items', data),
    );
    return result;
  }
  transformItems(docs: StoreItemDocument[]): ResStoreList {
    return docs.map((doc) => {
      return this.transformItem(doc);
    });
  }

  transformItem(doc: StoreItemDocument): ResStoreItem {
    return {
      name: doc.name,
      category: doc.category,
      stock: doc.stock,
      suppliers: [],
      unit: doc.unit,
    } satisfies ResStoreItem;
  }

  async updateItemStock(updateStock: UpdateItemStock): Promise<ResStoreItem> {
    console.log({ name: updateStock.name, stock: updateStock.stock });
    const x = await this.StoreItemModel.findOneAndUpdate(
      { name: updateStock.name },
      { stock: updateStock.stock },
    ).transform(this.transformItem);
    console.log(x);
    return x;
  }

  async removeAll(): Promise<void> {
    await this.StoreItemModel.deleteMany({});
  }

  async insertMany(items: StoreItem[]): Promise<void> {
    await this.StoreItemModel.insertMany(items);
  }

  getRandomPositiveCount(max: number) {
    return Math.floor(Math.random() * max + 1);
  }

  async seed(): Promise<void> {
    const storeItems: StoreItem[] = [];
    [ANIMAL_ORIGINS, PLANT_ORIGINS, MINING_ORIGINS].forEach((origin, i) => {
      const category =
        i === 0 ? Category.ANIMAL : i === 1 ? Category.PLANT : Category.MINING;
      origin.forEach((material) => {
        storeItems.push({
          name: material.name,
          stock: this.getRandomPositiveCount(10),
          unit: material.unit,
          category,
        } as any);
      });
    });
    await this.removeAll();
    await this.insertMany(storeItems);
  }

  async seedDB(): Promise<void> {
    await this.seed();
    await this.supplierService.seed();
  }
}
