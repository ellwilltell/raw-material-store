import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Category } from '@shared/category/category.enum';
import { Unit } from '@shared/unit/unit.enum';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class SupplierItem {
  @Prop({ type: Types.ObjectId })
  supplier: Types.ObjectId | string;

  @Prop({ type: String })
  name: string;
  @Prop({ type: String, enum: Object.values(Unit) })
  unit: Unit;
  @Prop({ type: String, enum: Object.values(Category) })
  category: Category;
  @Prop({ type: Number, default: 0 })
  stock: number;
  @Prop({ type: Number, default: 0 })
  price: number;
  created_at: Date;
  updated_at: Date;
}

export type SupplierItemDocument = HydratedDocument<SupplierItem>;

export const SupplierItemSchema = SchemaFactory.createForClass(SupplierItem);

SupplierItemSchema.index(
  {
    supplier: 1,
    name: 1,
    category: 1,
  },
  {
    partialFilterExpression: { stock: { $gt: 0 } },
    unique: true,
  },
);
