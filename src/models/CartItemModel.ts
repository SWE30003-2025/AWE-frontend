import type { ProductModel } from './ProductModel';

export interface CartItemModel extends ProductModel {
  quantity: number;
} 
