import { SupplierItem } from '../supplier-item.model';
export type SupplierRequest = Pick<SupplierItem, 'name' | 'category'>;
