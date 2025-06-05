import type { CartItemModel } from "./CartItemModel";

export interface ShoppingCartModel {
  id: string;
  user: string; // User ID
  total: number;
  total_items: number;
  items: CartItemModel[];
} ;
