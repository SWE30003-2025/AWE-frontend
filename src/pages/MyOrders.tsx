import { useEffect, useState } from "react";
import { getOrders } from "../api";
import type { OrderModel } from "../models/OrderModel";

export default function MyOrders() {
  const [orders, setOrders] = useState<OrderModel[]>([]);

  useEffect(() => {
    getOrders().then(data => {
      // Sort orders by created_at date, newest first
      const sortedOrders = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setOrders(sortedOrders);
    });
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
                {order.items.map((item, idx) => {
                  const individualPrice = parseFloat(item.price || item.price_at_purchase?.toString() || '0');
                  const totalPrice = individualPrice * item.quantity;
                  return (
                    <li key={idx}>
                      {item.product_name} - ${individualPrice.toFixed(2)} x {item.quantity} = ${totalPrice.toFixed(2)}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
