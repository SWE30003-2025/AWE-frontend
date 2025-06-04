export interface ShipmentModel {
  id: string;
  status: string;
  created_at: string;
  updated_at?: string;
  order_id?: string;
  tracking_number?: string;
  // Add other fields as needed
}

export interface ShipmentDashboardData {
  total_shipments: number;
  status_counts: { [status: string]: number };
  recent_shipments: ShipmentModel[];
} 
