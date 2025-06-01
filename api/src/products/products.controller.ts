import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';

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

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getProductDetail(@Param('id') productId: string, @Req() req: any) {
    return this.productsService.getProductById(productId, req.user.uid);
  }
}
