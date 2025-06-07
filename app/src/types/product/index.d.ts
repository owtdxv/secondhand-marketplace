export interface ProductInfo {
  _id: string;
  name: string;
  price: number;
  images: string[];
  lastUpdated: string;
}

export interface getProductResponse {
  items: Array[ProductInfo];
  page: number;
  totalPages: number;
}
