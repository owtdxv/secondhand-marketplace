import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from 'src/common/schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private jwtService: JwtService,
  ) {}

  /**
   * 사용자가 "판매중"인 상품을 filter조건에 맞게 반환합니다
   * @param uid 사용자 uid
   * @param filter 최신순(default), 낮은가격순, 높은가격순
   */
  async getSoldProduct(uid: string, filter: string = '최신순') {
    let query = this.productModel.find({
      sellerId: new Types.ObjectId(uid),
      status: '판매중',
    });

    switch (filter) {
      case '낮은가격순':
        query = query.sort({ price: 1 });
        break;
      case '높은가격순':
        query = query.sort({ price: -1 });
        break;
      case '최신순':
      default:
        query = query.sort({ createdAt: -1 });
        break;
    }

    return await query.exec();
  }

  /**
   * 사용자가 "판매완료"한 상품을 filter조건에 맞게 반환합니다
   * @param uid 사용자 uid
   * @param filter 최신순(default), 낮은가격순, 높은가격순
   */
  async getSoldOutProduct(uid: string, filter: string = '최신순') {
    let query = this.productModel.find({
      sellerId: new Types.ObjectId(uid),
      status: '판매완료',
    });

    switch (filter) {
      case '낮은가격순':
        query = query.sort({ price: 1 });
        break;
      case '높은가격순':
        query = query.sort({ price: -1 });
        break;
      case '최신순':
      default:
        query = query.sort({ createdAt: -1 });
        break;
    }

    return await query.exec();
  }
}
