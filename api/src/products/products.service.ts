import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/common/schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAll(filter: string) {
    const sortMap = {
      //근데 최신순이면 createdAt을 기준으로? 아니면 수정시를 생각해서 updatedAt?
      //각각 순서대로 최신순, 낮은가격순, 높은 가격순
      latest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
    };

    const sortOption = sortMap[filter] || sortMap['latest'];
    return this.productModel.find().sort(sortOption).exec();
  }
}
