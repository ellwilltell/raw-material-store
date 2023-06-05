import { ApiProperty } from '@nestjs/swagger';
import { Category } from '@shared/category/category.enum';
import { Unit } from '@shared/unit/unit.enum';
import { SupplierResult } from 'src/supplier/dto/supplier-result';

export class ResStoreItem {
  @ApiProperty({ type: String })
  name: String;
  @ApiProperty({ type: String, enum: Category })
  category: Category;
  @ApiProperty({ type: Number })
  stock: number;
  @ApiProperty({ type: SupplierResult, isArray: true })
  suppliers: SupplierResult[];
  @ApiProperty({ type: String, enum: Unit })
  unit: Unit;
}
export type ResStoreList = ResStoreItem[];
