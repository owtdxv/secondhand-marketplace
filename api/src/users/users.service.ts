import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from 'src/common/schemas/product.schema';
import { UserProductListDocument } from 'src/common/schemas/user-product-lists.schema';
import { User, UserDocument } from 'src/common/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel('LikedProducts')
    private readonly likedProductsModel: Model<UserProductListDocument>,
    @InjectModel('ViewedProducts')
    private readonly viewedProductsModel: Model<UserProductListDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * uid를 사용하여 해당 사용자의 프로필 이미지, 이메일, 닉네임과 판매중인 상품 개수를 반환합니다
   * @param uid 사용자 uid
   */
  async getUserInfo(uid: string) {
    const user = await this.userModel
      .findById(uid)
      .select('profileImage email displayName');

    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다');
    }

    const [totalCount, onSaleCount, soldOutCount] = await Promise.all([
      this.productModel.countDocuments({ sellerId: new Types.ObjectId(uid) }),
      this.productModel.countDocuments({
        sellerId: new Types.ObjectId(uid),
        status: '판매중',
      }),
      this.productModel.countDocuments({
        sellerId: new Types.ObjectId(uid),
        status: '판매완료',
      }),
    ]);

    return {
      profileImage: user.profileImage,
      email: user.email,
      displayName: user.displayName,
      productCounts: {
        total: totalCount,
        onSale: onSaleCount,
        soldOut: soldOutCount,
      },
    };
  }

  /**
   * 사용자의 프로필 이미지를 수정합니다
   * @param uid 사용자 uid
   * @param url 업로드한 프로필 이미지 url
   */
  async editProfileImage(uid: string, url: string) {
    if (!url) {
      throw new BadRequestException('잘못된 요청입니다');
    }
  }

  /**
   * 사용자 닉네임을 수정합니다
   * @param uid 사용자 uid
   * @param displayName 변경할 닉네임
   */
  async changeDisplayName(
    uid: String,
    displayName: string,
  ): Promise<{ success: Boolean }> {
    // 닉네임 중복 검사
    const existing = await this.userModel.exists({ displayName });
    if (existing) {
      throw new ConflictException('이미 사용중인 닉네임입니다.');
    }

    const result = await this.userModel.updateOne(
      { _id: uid },
      { $set: { displayName } },
    );

    return { success: result.modifiedCount > 0 };
  }
}
