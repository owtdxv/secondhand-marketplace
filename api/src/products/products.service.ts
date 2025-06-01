import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/common/schemas/product.schema';
import { User, UserDocument } from 'src/common/schemas/user.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(User.name) private userModel: Model<ProductDocument>,
  ) {}

  async findAll({
    page,
    limit,
    filter,
  }: {
    page: number;
    limit: number;
    filter: string;
  }) {
    const sortMap = {
      //근데 최신순이면 createdAt을 기준으로? 아니면 수정시를 생각해서 updatedAt?
      //각각 순서대로 최신순, 낮은가격순, 높은 가격순
      latest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
    };

    const sortOption = sortMap[filter] || sortMap['latest'];

    //28개씩 상품들을 나눠서 보여줌
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.productModel
        .find()
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.productModel.countDocuments(),
    ]);
    return {
      page,
      totalPages: Math.ceil(total / limit),
      items,
    };
  }

  async getProductById(productId: string, uid: string) {
    const product = await this.productModel
      .findByIdAndUpdate(productId, { $inc: { views: 1 } }, { new: true })
      .lean();

    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    //로그인한 사용자의 판매상품인경우를 체크하는 변수
    const isMine = product.sellerId.toString() === uid;

    //판메지의 정보를 가져와야하는데 이렇게 하는게 맞나?
    const seller: UserDocument = await this.userModel
      .findById(product.sellerId)
      .select('displayName profileImage');

    //판매자의 판매중, 판매완료 상품의 수
    const [onSaleCount, soldOutCount] = await Promise.all([
      this.productModel.countDocuments({
        sellerId: product.sellerId,
        status: '판매중',
      }),
      this.productModel.countDocuments({
        sellerId: product.sellerId,
        status: '판매완료',
      }),
    ]);

    return {
      ...product,
      isMine,
      seller: {
        displayName: seller?.displayName,
        profileImage: seller?.profileImage,
        onSaleCount,
        soldOutCount,
      },
    };
  }
}
