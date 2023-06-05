import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Supplier {
  _id: Types.ObjectId;
  @Prop({ type: String })
  name: string;

  created_at: Date;
  updated_at: Date;
}

export type SupplierDocument = HydratedDocument<Supplier>;

export const SupplierSchema = SchemaFactory.createForClass(Supplier);
