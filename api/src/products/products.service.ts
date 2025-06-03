import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from 'src/common/schemas/product.schema';
import { UserProductListDocument } from 'src/common/schemas/user-product-lists.schema';
import { User, UserDocument } from 'src/common/schemas/user.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel('LikedProducts')
    private readonly likedProductsModel: Model<UserProductListDocument>,
    @InjectModel('ViewedProducts')
    private readonly viewedProductsModel: Model<UserProductListDocument>,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<ProductDocument>,
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

  // 메인에서 전체상품보기로 넘어간경우
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

  // 상품을 클릭하여 상세보기로 넘어간경우
  async getProductById(productId: string, uid: string) {
    const product = await this.productModel
      .findByIdAndUpdate(
        productId,
        { $inc: { views: 1 } },
        { new: true, timestamps: false },
      )
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

    // 좋아요 여부
    const liked = await this.likedProductsModel.findOne({
      uid,
      productIds: product._id,
    });

    const isLiked = !!liked;

    // viewedProducts에 추가
    const viewedDoc = await this.viewedProductsModel.findOne({
      uid: new Types.ObjectId(uid),
    });

    if (viewedDoc) {
      // 이미 본 상품의 경우 해당 값을 제거하고
      viewedDoc.productIds = viewedDoc.productIds.filter(
        (id) => id.toString() !== productId,
      );

      // 배열 맨 앞에 추가
      viewedDoc.productIds.unshift(product._id as Types.ObjectId);

      await viewedDoc.save();
    } else {
      await this.viewedProductsModel.create({
        uid: new Types.ObjectId(uid),
        productIds: [product._id],
      });
    }

    function getRelativeTime(date: Date): string {
      const diffMs = Date.now() - new Date(date).getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);

      if (diffSec < 60) return '방금 전';
      if (diffMin < 60) return `${diffMin}분 전`;
      if (diffHour < 24) return `${diffHour}시간 전`;
      if (diffDay < 7) return `${diffDay}일 전`;
      return new Date(date).toLocaleDateString(); // 'YYYY.MM.DD'
    }

    return {
      ...product,
      isMine,
      isLiked,
      lastUpdated: getRelativeTime(new Date((product as any).updatedAt)),
      seller: {
        displayName: seller?.displayName,
        profileImage: seller?.profileImage,
        onSaleCount,
        soldOutCount,
      },
    };
  }

  // 좋아요 처리 -> LikedProducts에 추가, 좋아요수 +1,
  // 좋아요 취소 -> LikedProducts에서 제거, 좋아요수 -1,
  async toggleLike(productId: string, uid: string) {
    const product = await this.productModel.findById(productId);
    if (!product) throw new NotFoundException('상품을 찾을 수 없습니다.');

    const likedDoc = await this.likedProductsModel.findOne({
      uid: new Types.ObjectId(uid),
    });

    const alreadyLiked = likedDoc?.productIds?.some(
      (id) => id.toString() === productId,
    );

    //이미 좋아요였던 경우
    if (alreadyLiked) {
      product.likes = Math.max(0, product.likes - 1);
      await product.save();

      // LikedProducts에서 해당 상품 제거
      await this.likedProductsModel.updateOne(
        { uid: new Types.ObjectId(uid) },
        { $pull: { productIds: product._id } },
      );

      return {
        message: '좋아요가 취소되었습니다.',
        isLiked: false,
        likes: product.likes,
      };
    } else {
      product.likes += 1;
      await product.save();

      if (likedDoc) {
        likedDoc.productIds.push(product._id as Types.ObjectId);
        await likedDoc.save();
      } else {
        await this.likedProductsModel.create({
          uid: new Types.ObjectId(uid),
          productIds: [product._id],
        });
      }

      return {
        message: '좋아요가 추가되었습니다.',
        isLiked: true,
        likes: product.likes,
      };
    }
  }
}
