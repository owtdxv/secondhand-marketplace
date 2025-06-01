import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('product')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async getAllProducts(
    @Query('page') page = '1',
    @Query('filter') filter: string,
  ) {
    return this.productsService.findAll({
      page: parseInt(page),
      limit: 2,
      filter,
    });
  }
}
