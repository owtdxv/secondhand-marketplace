import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from 'src/common/schemas/product.schema';
import { UserProductListDocument } from 'src/common/schemas/user-product-lists.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel('LikedProducts')
    private readonly likedProductsModel: Model<UserProductListDocument>,
    @InjectModel('ViewedProducts')
    private readonly viewedProductsModel: Model<UserProductListDocument>,
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

  /**
   * 사용자가 좋아요 표시한 상품 정보를 filter조건에 맞게 반환합니다
   * @param uid 사용자 uid
   * @param filter 최신순(default), 낮은가격순, 높은가격순
   */
  async getLikedProduct(
    uid: string,
    filter: string = '최신순',
  ): Promise<Product[]> {
    let sortOption: Record<string, 1 | -1> = { createdAt: -1 }; // 기본값: 상품 등록일 최신순

    switch (filter) {
      case '낮은가격순':
        sortOption = { price: 1 };
        break;
      case '높은가격순':
        sortOption = { price: -1 };
        break;
      case '최신순': // 상품의 등록일 기준 최신순 (Product.createdAt)
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    const userLikedList = await this.likedProductsModel
      .findOne({ uid: new Types.ObjectId(uid) })
      .populate<{ productIds: Product[] }>({
        path: 'productIds',
        options: { sort: sortOption },
      })
      .exec();

    if (
      !userLikedList ||
      !userLikedList.productIds ||
      userLikedList.productIds.length === 0
    ) {
      return [];
    }

    return userLikedList.productIds;
  }

  /**
   * 사용자가 최근 확인한 상품 정보를 filter조건에 맞게 반환합니다
   * @param uid 사용자 uid
   * @param filter 최신순(default), 낮은가격순, 높은가격순
   */
  async getViewedProduct(
    uid: string,
    filter: string = '최신순',
  ): Promise<Product[]> {
    let sortOption: Record<string, 1 | -1> = { createdAt: -1 }; // 기본값: 상품 등록일 최신순

    switch (filter) {
      case '낮은가격순':
        sortOption = { price: 1 };
        break;
      case '높은가격순':
        sortOption = { price: -1 };
        break;
      case '최신순': // 상품의 등록일 기준 최신순 (Product.createdAt)
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    const userLikedList = await this.likedProductsModel
      .findOne({ uid: new Types.ObjectId(uid) })
      .populate<{ productIds: Product[] }>({
        path: 'productIds',
        options: { sort: sortOption },
      })
      .exec();

    if (
      !userLikedList ||
      !userLikedList.productIds ||
      userLikedList.productIds.length === 0
    ) {
      return [];
    }

    return userLikedList.productIds;
  }
}
