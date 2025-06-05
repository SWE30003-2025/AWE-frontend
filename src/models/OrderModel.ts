import type { OrderItemModel } from "./OrderItemModel";
import type { ShipmentModel } from "./ShipmentModel";

export interface OrderModel {
  id: number;
  user: string;
  created_at: string;
  status?: string;
  total: number;
  items: OrderItemModel[];
  shipment?: ShipmentModel;
  shipping_full_name?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_postal_code?: string;
};
