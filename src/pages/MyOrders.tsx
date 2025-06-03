import { useEffect, useState } from "react";
import { getOrders, Order } from "../api";

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    getOrders().then(setOrders);
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        orders.map(order => (
          <div key={order.id} className="border rounded mb-4 p-4">
            <div>
              <strong>Order #:</strong> {order.id}
            </div>
            <div>
              <strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}
            </div>
            <div>
              <strong>Status:</strong> {order.status}
            </div>
            <div>
              <strong>Total:</strong> ${order.total}
            </div>
            <div>
              <strong>Items:</strong>
              <ul>
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.product_name} x {item.quantity} @ ${item.price_at_purchase}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
