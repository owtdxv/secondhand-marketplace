import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('product')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async getAllProducts(@Query('filter') filter: string) {
    return this.productsService.findAll(filter);
  }
}
