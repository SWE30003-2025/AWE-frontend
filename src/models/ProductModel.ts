export interface ProductModel {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  is_active: boolean;
};

// Partial interfaces for API operations
export type CreateProductModel = Omit<ProductModel, "id" | "is_active">;
export type UpdateProductModel = Partial<Omit<ProductModel, "id" | "is_active">>;
