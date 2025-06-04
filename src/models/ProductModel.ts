export interface ProductModel {
  id: string;  // UUID from backend
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}
