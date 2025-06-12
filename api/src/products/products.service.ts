import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Post,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from 'src/common/schemas/product.schema';
import {
  RecentSearch,
  RecentSearchDocument,
} from 'src/common/schemas/recentSearch';
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
    @InjectModel(RecentSearch.name)
    private readonly recentSearchModel: Model<RecentSearchDocument>,
  ) {}

  /**
   * 사용자의 좋아요한 상품, 최근 검색어 등을 사용하여 추천 상품을 표시합니다(페이지네이션 없음)
   * @param uid 사용자 uid
   */
  async getRecommendProduct(uid: string) {
    const getLikedList = await this.likedProductsModel
      .findOne({ uid: new Types.ObjectId(uid) })
      .lean()
      .exec();

    const getViewedList = await this.viewedProductsModel
      .findOne({ uid: new Types.ObjectId(uid) })
      .lean()
      .exec();

    const likedIds = getLikedList?.productIds || [];
    const viewedIds = getViewedList?.productIds || [];
    const recentProductIds = [...likedIds, ...viewedIds];

    if (recentProductIds.length === 0) {
      // 없으면 랜덤 상품 표시
      const randomProducts = await this.productModel.aggregate([
        { $sample: { size: 6 } },
      ]);

      return randomProducts;
    }

    // 최근 본/좋아한 상품에서 카테고리 추출
    const recentProducts = await this.productModel
      .find({ _id: { $in: recentProductIds } })
      .lean()
      .exec();

    const categories = [...new Set(recentProducts.map((p) => p.category))];
    const saleRegions = [...new Set(recentProducts.map((p) => p.saleRegion))];

    const recommended = await this.productModel
      .find({
        category: { $in: categories },
        saleRegion: { $in: saleRegions },
        status: '판매중',
        _id: { $nin: recentProductIds }, // 본 것/좋아요 한 것은 제외
      })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean()
      .exec();

    const items = recommended.map((item) => ({
      ...item,
      lastUpdated: this.getRelativeTime(new Date((item as any).updatedAt)),
    }));

    return items;
  }

  /**
   * 사용자가 "판매중"인 상품을 정렬 조건에 맞게 반환합니다
   * @param uid 사용자 uid
   * @param page 현재 페이지 번호
   * @param limit 페이지 당 상품 수
   * @param filter 정렬 조건
   */
  async getSoldProduct(
    uid: string,
    page: number,
    limit: number,
    filter: string = 'latest',
  ) {
    const sellerId = new Types.ObjectId(uid);
    const sortMap = {
      latest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
    };
    const sortOption = sortMap[filter] || sortMap['latest'];

    const skip = (page - 1) * limit;
    const [rawItems, total] = await Promise.all([
      this.productModel
        .find({
          sellerId: sellerId,
          status: '판매중',
        })
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.productModel.countDocuments({
        sellerId: sellerId,
        status: '판매중',
      }),
    ]);

    const items = rawItems.map((item) => ({
      ...item,
      lastUpdated: this.getRelativeTime(new Date((item as any).updatedAt)),
    }));
    return {
      page,
      totalPages: Math.ceil(total / limit),
      items,
    };
  }

  /**
   * 사용자가 "판매완료"한 상품을 filter조건에 맞게 반환합니다
   * @param uid 사용자 uid
   * @param page 현재 페이지 번호
   * @param limit 페이지 당 상품 수
   * @param filter 정렬 조건
   */
  async getSoldOutProduct(
    uid: string,
    page: number,
    limit: number,
    filter: string = 'latest',
  ) {
    const sellerId = new Types.ObjectId(uid);
    const sortMap = {
      latest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
    };
    const sortOption = sortMap[filter] || sortMap['latest'];

    const skip = (page - 1) * limit;
    const [rawItems, total] = await Promise.all([
      this.productModel
        .find({
          sellerId: sellerId,
          status: '판매완료',
        })
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.productModel.countDocuments({
        sellerId: sellerId,
        status: '판매완료',
      }),
    ]);

    const items = rawItems.map((item) => ({
      ...item,
      lastUpdated: this.getRelativeTime(new Date((item as any).updatedAt)),
    }));
    return {
      page,
      totalPages: Math.ceil(total / limit),
      items,
    };
  }

  /**
   * 사용자가 좋아요 표시한 상품 정보를 filter조건에 맞게 반환합니다
   * @param uid 사용자 uid
   * @param page 현재 페이지 번호
   * @param limit 페이지 당 상품 수
   * @param filter 정렬 조건
   */
  async getLikedProduct(
    uid: string,
    page: number,
    limit: number,
    filter: string = 'latest',
  ) {
    const sortMap = {
      latest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
    };
    const sortOption = sortMap[filter] || sortMap['latest'];

    const skip = (page - 1) * limit;

    // 1단계: 유저의 찜 목록 가져오기
    const userLikedList = await this.likedProductsModel
      .findOne({ uid: new Types.ObjectId(uid) })
      .lean()
      .exec();

    if (
      !userLikedList ||
      !userLikedList.productIds ||
      userLikedList.productIds.length === 0
    ) {
      return {
        page,
        totalPages: 0,
        items: [],
      };
    }

    const likedProductIds = userLikedList.productIds;

    // 2단계: 찜한 상품 중 일부만 정렬 + 페이징해서 가져오기
    const [items, total] = await Promise.all([
      this.productModel
        .find({ _id: { $in: likedProductIds } })
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.productModel.countDocuments({ _id: { $in: likedProductIds } }),
    ]);

    return {
      page,
      totalPages: Math.ceil(total / limit),
      items,
    };
  }

  /**
   * 사용자가 최근 확인한 상품 정보를 filter조건에 맞게 반환합니다
   * @param uid 사용자 uid
   * @param page 현재 페이지 번호
   * @param limit 페이지 당 상품 수
   * @param filter 정렬 조건
   */
  async getViewedProduct(
    uid: string,
    page: number,
    limit: number,
    filter: string = 'latest',
  ) {
    const sortMap = {
      latest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
    };
    const sortOption = sortMap[filter] || sortMap['latest'];

    const skip = (page - 1) * limit;

    // 1단계: 유저의 찜 목록 가져오기
    const userViewedList = await this.viewedProductsModel
      .findOne({ uid: new Types.ObjectId(uid) })
      .lean()
      .exec();

    if (
      !userViewedList ||
      !userViewedList.productIds ||
      userViewedList.productIds.length === 0
    ) {
      return {
        page,
        totalPages: 0,
        items: [],
      };
    }

    const likedProductIds = userViewedList.productIds;

    // 2단계: 찜한 상품 중 일부만 정렬 + 페이징해서 가져오기
    const [items, total] = await Promise.all([
      this.productModel
        .find({ _id: { $in: likedProductIds } })
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.productModel.countDocuments({ _id: { $in: likedProductIds } }),
    ]);

    return {
      page,
      totalPages: Math.ceil(total / limit),
      items,
    };
  }

  //상품 생성시간과 현재시간 비교하는 함수
  getRelativeTime(date: Date): string {
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
      latest: { updatedAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
    };

    const sortOption = sortMap[filter] || sortMap['latest'];

    //28개씩 상품들을 나눠서 보여줌
    const skip = (page - 1) * limit;

    const [rawItems, total] = await Promise.all([
      this.productModel
        .find()
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.productModel.countDocuments(),
    ]);

    const items = rawItems.map((item) => ({
      ...item,
      lastUpdated: this.getRelativeTime(new Date((item as any).updatedAt)),
    }));
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
    const isMine = uid == '' ? product.sellerId.toString() === uid : false;

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

    let isLiked = false;
    let isUser = false;
    // 로그인한 사용자의 경우 좋아요와, 최근 본 상품에 등록
    if (uid != '') {
      isUser = true;
      const liked = await this.likedProductsModel.findOne({
        uid: new Types.ObjectId(uid),
        productIds: product._id,
      });
      isLiked = !!liked;

      const viewedDoc = await this.viewedProductsModel.findOne({
        uid: new Types.ObjectId(uid),
      });

      if (viewedDoc) {
        viewedDoc.productIds = viewedDoc.productIds.filter(
          (id) => id.toString() !== productId,
        );
        viewedDoc.productIds.unshift(product._id as Types.ObjectId);
        await viewedDoc.save();
      } else {
        await this.viewedProductsModel.create({
          uid: new Types.ObjectId(uid),
          productIds: [product._id],
        });
      }
    }

    return {
      ...product,
      isUser,
      isMine,
      isLiked,
      lastUpdated: this.getRelativeTime(new Date((product as any).updatedAt)),
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

  //메인 최근 올라온 상품 최대 30개
  async getRecentProducts({ page, limit }: { page: number; limit: number }) {
    const maxLimit = 30;

    const skip = (page - 1) * limit;

    const rawItems = await this.productModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const items = rawItems.map((item) => ({
      ...item,
      lastUpdated: this.getRelativeTime(new Date((item as any).updatedAt)),
    }));

    const totalPages = Math.ceil(maxLimit / limit);

    return {
      page,
      totalPages,
      items,
    };
  }

  //메인 좋아요가 많은 상품 최대 30개
  async getTopLikeProducts({ page, limit }: { page: number; limit: number }) {
    const maxLimit = 30;

    const skip = (page - 1) * limit;

    const rawItems = await this.productModel
      .find()
      .sort({ likes: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const items = rawItems.map((item) => ({
      ...item,
      lastUpdated: this.getRelativeTime(new Date((item as any).updatedAt)),
    }));

    const totalPages = Math.ceil(maxLimit / limit);

    return {
      page,
      totalPages,
      items,
    };
  }

  //메인 조회수가 많은 상품 최대 30개
  async getTopViewProducts({ page, limit }: { page: number; limit: number }) {
    const maxLimit = 30;

    const skip = (page - 1) * limit;

    const rawItems = await this.productModel
      .find()
      .sort({ views: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const items = rawItems.map((item) => ({
      ...item,
      lastUpdated: this.getRelativeTime(new Date((item as any).updatedAt)),
    }));

    const totalPages = Math.ceil(maxLimit / limit);

    return {
      page,
      totalPages,
      items,
    };
  }

  //상품 등록
  async createProduct({ body, uid }: { body: any; uid: string }) {
    const { images, name, price, category, saleRegion, description } = body;

    if (!images || !Array.isArray(images) || images.length === 0)
      throw new BadRequestException('상품 이미지를 1개 이상 포함해야 합니다.');

    if (!name) throw new BadRequestException('상품명을 입력해주세요.');

    if (!price || typeof price !== 'number')
      throw new BadRequestException('상품의 가격을 입력해주세요.');

    if (!category)
      throw new BadRequestException('상품의 카테고리를 입력해주세요.');

    if (!saleRegion)
      throw new BadRequestException('상품 판매 지역을 입력해주세요.');

    if (!description)
      throw new BadRequestException('상품에 대한 설명을 입력해주세요.');

    const product = new this.productModel({
      images,
      name,
      price,
      category,
      saleRegion,
      description,
      status: '판매중',
      sellerId: uid,
    });

    await product.save();
    return {
      _id: product._id,
      statusCode: 201,
      message: '상품이 성공적으로 등록되었습니다.',
    };
  }

  //상품 정보 수정
  async updateProduct({
    productId,
    uid,
    body,
  }: {
    productId: string;
    uid: string;
    body: any;
  }) {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    if (product.sellerId.toString() !== uid) {
      throw new ForbiddenException('수정 권한이 없습니다.');
    }

    const allowedFields = [
      'name',
      'price',
      'category',
      'saleRegion',
      'description',
      'images',
    ];

    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        product[key] = body[key];
      }
    }

    await product.save();

    return {
      statusCode: 200,
      message: '상품이 성공적으로 수정되었습니다.',
    };
  }

  // 판매상태 변경 (uid가 sellerId와 동일한지 체크후 상태 변경)
  async updateProductStatus(
    productId: string,
    status: '판매중' | '판매완료',
    uid: string,
  ) {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    if (product.sellerId.toString() !== uid) {
      throw new ForbiddenException('수정 권한이 없습니다.');
    }

    product.status = status;
    await product.save();

    return {
      result: true,
      message: '상품 상태가 변경되었습니다.',
      status: status,
    };
  }

  // 판매상품 삭제(uid와 sellerId가 동일한 경우만 삭제 가능)
  async deleteProduct(productId: string, uid: string) {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    if (product.sellerId.toString() !== uid) {
      throw new ForbiddenException('삭제 권한이 없습니다.');
    }

    await product.deleteOne();

    return { result: true, message: '상품이 삭제되었습니다.' };
  }

  //최근 검색어 얻어오기
  async getRecentKeywords(uid: string) {
    if (!Types.ObjectId.isValid(uid)) {
      return { keywords: [] };
    }
    const keywords = await this.recentSearchModel.findOne({
      uid: new Types.ObjectId(uid),
    });

    return { keywords: keywords?.keywords ?? [] };
  }

  async deleteRecentKeywords(keyword: string, uid: string) {
    if (!Types.ObjectId.isValid(uid)) {
      throw new BadRequestException('잘못된 사용자 ID입니다.');
    }
    const recentKeywords = await this.recentSearchModel.findOne({
      uid: new Types.ObjectId(uid),
    });
    if (!recentKeywords) {
      throw new NotFoundException('삭제할 키워드를 찾지 못했습니다.');
    }

    await this.recentSearchModel.updateOne(
      { uid: new Types.ObjectId(uid) },
      { $pull: { keywords: keyword } },
    );

    const updated = await this.recentSearchModel.findOne({
      uid: new Types.ObjectId(uid),
    });

    return {
      result: true,
      message: '키워드가 삭제되었습니다.',
      keywords: updated?.keywords ?? [],
    };
  }
  //검색 상품 가져오기
  async searchProducts({
    input,
    uid,
    page,
    limit,
    filter,
  }: {
    input: string;
    uid: string;
    page: number;
    limit: number;
    filter: string;
  }) {
    const sortMap = {
      latest: { updatedAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
    };
    const sortOption = sortMap[filter] || sortMap['latest'];

    const skip = (page - 1) * limit;

    const [rawItems, total] = await Promise.all([
      this.productModel
        .find({
          name: { $regex: input, $options: 'i' },
        })
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.productModel.countDocuments({
        name: { $regex: input, $options: 'i' },
      }),
    ]);

    const items = rawItems.map((item) => ({
      ...item,
      lastUpdated: this.getRelativeTime(new Date((item as any).updatedAt)),
    }));
    // 로그인이 되어있는 경우에는 최근 검색어에 추가
    if (Types.ObjectId.isValid(uid)) {
      const normalizedInput = input.trim().toLowerCase();

      const recent = await this.recentSearchModel.findOne({
        uid: new Types.ObjectId(uid),
      });

      if (recent) {
        recent.keywords = recent.keywords.filter(
          (kw) => kw.trim().toLowerCase() !== normalizedInput,
        );

        recent.keywords.unshift(input); // 원래 입력값 그대로 추가

        if (recent.keywords.length > 5) {
          recent.keywords = recent.keywords.slice(0, 5);
        }

        await recent.save();
      } else {
        await this.recentSearchModel.create({
          uid: new Types.ObjectId(uid),
          keywords: [input],
        });
      }
    }

    return {
      page,
      totalPages: Math.ceil(total / limit),
      totalProduct: total,
      items,
    };
  }
}
