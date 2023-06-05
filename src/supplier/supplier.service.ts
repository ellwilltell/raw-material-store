import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Supplier, SupplierDocument } from './supplier.model';
import { Model } from 'mongoose';
import { SUPPLIER_NAMES } from '@shared/seed/supplier-names';
import { Category } from '@shared/category/category.enum';
import { ANIMAL_ORIGINS } from '@shared/seed/animal-origins';
import { MINING_ORIGINS } from '@shared/seed/mining-origins';
import { SupplierItem } from './supplier-item.model';
import { PLANT_ORIGINS } from '@shared/seed/plant-origins';
import { SupplierItemService } from './supplier-item.service';
import { SupplierResult } from './dto/supplier-result';
import { SupplierRequest } from './dto/supplier-request';

@Injectable()
export class SupplierService {
  constructor(
    @InjectModel(Supplier.name)
    private readonly SupplierModel: Model<SupplierDocument>,
    private readonly supplierItemService: SupplierItemService,
  ) {}

  async getItems(params: { data: SupplierRequest }): Promise<SupplierResult[]> {
    return this.transform(await this.supplierItemService.getItems(params.data));
  }
  transform(result: Partial<SupplierItem>[]): SupplierResult[] {
    return result.map((result) => {
      return { price: result.price, supplier: result.supplier as string };
    });
  }

  async removeAll(): Promise<void> {
    await this.SupplierModel.deleteMany({});
  }

  async insertMany(items: Partial<Supplier>[]): Promise<SupplierDocument[]> {
    return await this.SupplierModel.insertMany(items);
  }

  getRandomPositiveCount(max: number) {
    return Math.floor(Math.random() * max + 1);
  }

  getRandomPrice() {
    return Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
  }

  shouldSkip(percent: number) {
    return Math.random() > percent / 100;
  }

  async seed(): Promise<void> {
    await this.removeAll();
    const suppliers: Partial<Supplier>[] = SUPPLIER_NAMES.map((name) => {
      return { name, items: [] };
    });
    const supplierDocuments = await this.insertMany(suppliers);
    const supplierItems: Partial<SupplierItem>[] = [];
    await Promise.all(
      [ANIMAL_ORIGINS, PLANT_ORIGINS, MINING_ORIGINS].map((origin, i) => {
        const category =
          i === 0
            ? Category.ANIMAL
            : i === 1
            ? Category.PLANT
            : Category.MINING;
        origin.forEach((material) => {
          if (this.shouldSkip(50)) return;
          supplierDocuments.forEach((supplier) => {
            if (!this.shouldSkip(50)) return;
            supplierItems.push({
              name: material.name,
              price: this.getRandomPrice(),
              stock: this.getRandomPositiveCount(10),
              unit: material.unit,
              category,
              supplier: supplier._id,
            });
          });
        });
      }),
    );
    await this.supplierItemService.removeAll();
    await this.supplierItemService.insertMany(supplierItems);
  }
}
