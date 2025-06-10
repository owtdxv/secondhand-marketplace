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
import { JwtService } from '@nestjs/jwt';

@Controller('product')
export class ProductsController {
  constructor(
    private productsService: ProductsService,
    private readonly jwtService: JwtService,
  ) {}

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

  // 상품 최근 검색 키워드 얻어오기
  @Get('recent-keywords')
  async recentKeywords(@Req() req: any) {
    const authHeader = req.headers.authorization;
    let uid: string = '';

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const payload: any = this.jwtService.verify(token);
        uid = payload.sub;
      } catch {
        uid = '';
      }
    }
    return this.productsService.getRecentKeywords(uid);
  }

  @Delete('recent-keywords')
  async deleteRecentKeywords(
    @Query('keyword') keyword: string,
    @Req() req: any,
  ) {
    const authHeader = req.headers.authorization;
    let uid: string = '';

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const payload: any = this.jwtService.verify(token);
        uid = payload.sub;
      } catch {
        uid = '';
      }
    }
    return this.productsService.deleteRecentKeywords(keyword, uid);
  }

  // 삼품 검색시 최근검색어에 추가 및 상품 검색
  @Get('search')
  async searchProducts(@Query('input') input: string, @Req() req: any) {
    const authHeader = req.headers.authorization;
    let uid: string = '';

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const payload: any = this.jwtService.verify(token);
        uid = payload.sub;
      } catch {
        uid = '';
      }
    }
    return this.productsService.searchProducts(input, uid);
  }

  @Get(':id')
  async getProductDetail(@Param('id') productId: string, @Req() req: any) {
    const authHeader = req.headers.authorization;
    let uid: string = '';

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const payload: any = this.jwtService.verify(token);
        uid = payload.sub;
      } catch {
        uid = '';
      }
    }

    return this.productsService.getProductById(productId, uid);
  }

  @Put('add-like/:id')
  @UseGuards(AuthGuard('jwt'))
  async toggleLike(@Param('id') productId: string, @Req() req: any) {
    return this.productsService.toggleLike(productId, req.user.uid);
  }

  //새 상품 추가
  @Post('new')
  @UseGuards(AuthGuard('jwt'))
  async createProduct(@Body() body: any, @Req() req: any) {
    const uid = req.user.uid;
    return this.productsService.createProduct({ body, uid });
  }

  //상품 수정
  @Put('edit/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateProduct(
    @Param('id') productId: string,
    @Body() body: any,
    @Req() req: any,
  ) {
    const uid = req.user.uid;
    return this.productsService.updateProduct({ productId, body, uid });
  }
  @Put('update-status/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateStatus(
    @Param('id') productId: string,
    @Body('status') status: '판매중' | '판매완료',
    @Req() req,
  ) {
    return this.productsService.updateProductStatus(
      productId,
      status,
      req.user.uid,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') productId: string, @Req() req) {
    return this.productsService.deleteProduct(productId, req.user.uid);
  }
}
