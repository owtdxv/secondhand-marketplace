export interface ProductInfo {
  _id: string;
  name: string;
  price: number;
  images: string[];
  lastUpdated: string;
}

export interface getProductResponse {
  items: ProductInfo[];
  page: number;
  totalPages: number;
}

export interface ProductDetailInfo {
  _id: string;
  category: string;
  description: string;
  images: string[];
  isUser: boolean;
  isLiked: boolean;
  isMine: boolean;
  lastUpdated: string;
  likes: number;
  views: number;
  name: string;
  price: number;
  saleRegion: string;
  seller: SellerInfo;
  sellerId: string;
  status: string;
}

export interface SellerInfo {
  displayName: string;
  onSaleCount: number;
  profileImage: string;
  soldOutCount: number;
}
