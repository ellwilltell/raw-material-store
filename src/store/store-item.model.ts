import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '@shared/category/category.enum';
import { Unit } from '@shared/unit/unit.enum';
import { IsNotEmpty, IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { SupplierResult } from 'src/supplier/dto/supplier-result';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class StoreItem {
  @Prop({ type: String, index: true, unique: true })
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: String, enum: Object.values(Category) })
  @ApiProperty({ enum: Category })
  category: Category;

  @Prop({ type: String, enum: Object.values(Unit) })
  @ApiProperty({ enum: Unit, isArray: true })
  unit: Unit;

  suppliers: SupplierResult[];

  @Prop({ type: Number })
  @ApiProperty({ type: Number })
  stock: number;

  created_at: Date;
  updated_at: Date;
}

export type StoreItemDocument = HydratedDocument<StoreItem>;

export const StoreItemSchema = SchemaFactory.createForClass(StoreItem);
