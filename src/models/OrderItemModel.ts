export interface OrderItemModel {
  product_id?: string; // PK
  product?: string; // Backend uses this field name
  product_name: string;
  quantity: number;
  price: string; // Backend returns this as string
  price_at_purchase?: number; // Keep for backward compatibility
} 
