export interface ProductModel {
  id: string;  // UUID from backend
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

// Partial interfaces for API operations
export type CreateProductModel = Omit<ProductModel, "id">;
export type UpdateProductModel = Partial<ProductModel>;
