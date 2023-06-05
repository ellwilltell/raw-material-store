import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SupplierItem, SupplierItemDocument } from './supplier-item.model';
import { Model } from 'mongoose';
import { SupplierRequest } from './dto/supplier-request';

@Injectable()
export class SupplierItemService {
  constructor(
    @InjectModel(SupplierItem.name)
    private readonly SupplierDocument: Model<SupplierItemDocument>,
  ) {}

  async getItems(request: SupplierRequest): Promise<Partial<SupplierItem>[]> {
    return await this.SupplierDocument.aggregate([
      {
        $match: {
          $and: [
            { name: request.name },
            { category: request.category },
            { stock: { $gt: 0 } },
          ],
        },
      },
      {
        $lookup: {
          from: 'suppliers',
          localField: 'supplier',
          foreignField: '_id',
          as: 'supplier',
        },
      },
      {
        $project: {
          supplier: { $arrayElemAt: ['$supplier.name', 0] },
          price: '$price',
        },
      },
    ]);
  }

  removeAll() {
    return this.SupplierDocument.deleteMany({});
  }

  insertMany(supplierItems: Partial<SupplierItem>[]) {
    return this.SupplierDocument.insertMany(supplierItems);
  }
}
