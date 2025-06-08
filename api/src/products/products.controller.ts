import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
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
      limit: 28,
      filter,
    });
  }

  //최근 올라온 상품 30개 조회
  @Get('recent')
  async getRecent(@Query('page') page = '1') {
    return this.productsService.getRecentProducts({
      page: parseInt(page),
      limit: 6,
    });
  }

  //좋아요가 많은 상품 상위 30개 조회
  @Get('top-like')
  async getTopLike(@Query('page') page = '1') {
    return this.productsService.getTopLikeProducts({
      page: parseInt(page),
      limit: 6,
    });
  }

  //조회수가 많은 상품 상위 30개 조회
  @Get('top-view')
  async getTopView(@Query('page') page = '1') {
    return this.productsService.getTopViewProducts({
      page: parseInt(page),
      limit: 6,
    });
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getProductDetail(@Param('id') productId: string, @Req() req: any) {
    return this.productsService.getProductById(productId, req.user.uid);
  }

  @Put('add-like/:id')
  @UseGuards(AuthGuard('jwt'))
  async toggleLike(@Param('id') productId: string, @Req() req: any) {
    return this.productsService.toggleLike(productId, req.user.uid);
  }

  @Post('new')
  @UseGuards(AuthGuard('jwt'))
  async createProduct(@Body() body: any, @Req() req: any) {
    const uid = req.user.uid;
    return this.productsService.createProduct({ body, uid });
  }
}
