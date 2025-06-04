export interface ShipmentModel {
  id: number;
  tracking_number: string;
  status: string;
  carrier: string;
  estimated_delivery: string;
  actual_delivery: string | null;
  created_at: string;
  updated_at: string;
  order_id?: string;
}

export interface ShipmentDashboardData {
  total_shipments: number;
  status_counts: { [status: string]: number };
  pending_shipments: number;
  in_transit_shipments: number;
  delivered_shipments: number;
  recent_shipments: ShipmentModel[];
} 
