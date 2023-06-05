import { Body, Controller, Get, Post } from '@nestjs/common';
import { StoreService } from './store.service';
import { ResStoreItem, ResStoreList } from './dto/res.store.list';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateItemStock } from './dto/req.update-item-stock';

@Controller('store')
@ApiTags('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  @ApiResponse({ type: ResStoreItem, isArray: true })
  async getItemList(): Promise<ResStoreList> {
    return this.storeService.getSToreItems();
  }

  @Post('stock')
  @ApiResponse({ type: ResStoreItem })
  async updateShopItemStock(
    @Body() updateStock: UpdateItemStock,
  ): Promise<ResStoreItem> {
    console.log(updateStock);
    return this.storeService.updateItemStock(updateStock);
  }

  @Post('seed')
  @ApiResponse({ status: 'default' })
  seed(): Promise<void> {
    return this.storeService.seedDB();
  }
}
