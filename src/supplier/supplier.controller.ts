import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SupplierService } from './supplier.service';
import { Category } from '@shared/category/category.enum';
import { SupplierResult } from './dto/supplier-result';

@Controller()
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @MessagePattern('items')
  getItems(
    @Payload() data: { data: { name: string; category: Category } },
  ): Promise<SupplierResult[]> {
    return this.supplierService.getItems(data);
  }
}
