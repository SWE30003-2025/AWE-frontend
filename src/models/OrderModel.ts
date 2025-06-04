import type { OrderItemModel } from './OrderItemModel';

export interface OrderModel {
  id: number;
  user: string;
  created_at: string;
  status?: string;
  total: number;
  items: OrderItemModel[];
} 
