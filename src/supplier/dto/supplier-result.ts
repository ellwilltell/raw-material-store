import { ApiProperty } from '@nestjs/swagger';

export class SupplierResult {
  @ApiProperty({ type: Number })
  price: number;
  @ApiProperty({ type: String })
  supplier: string;
}
