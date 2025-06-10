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

export interface createProduct {
  name?: string;
  category?: string;
  region?: string;
  price?: number;
  description?: string;
}
