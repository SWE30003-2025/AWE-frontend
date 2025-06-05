export interface CartItemModel {
  id: string;
  product: string; // Product ID
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
};

export interface CreateCartItemModel {
  product_id: string;
  quantity: number;
};

export interface UpdateCartItemModel {
  product_id: string;
  quantity: number;
};
