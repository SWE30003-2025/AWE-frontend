import { useEffect, useState } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(allOrders);
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">All Orders (Admin)</h2>
      {orders.length === 0 ? (
        <p className="text-gray-600 text-center">No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded shadow p-4">
              <div className="font-bold mb-1">Order ID: {order.id} — Placed by: {order.user}</div>
              <div className="mb-1">Order Date: {order.date}</div>
              <div className="mb-1">
                <span className="font-semibold">Shipping:</span> {order.shipping.address}, {order.shipping.city}, {order.shipping.postal}
              </div>
              <div className="mb-1">
                <span className="font-semibold">Items:</span>
                <ul className="ml-4">
                  {order.cart.map(item => (
                    <li key={item.id}>{item.name} x {item.quantity} (${item.price} each)</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-semibold">Total: </span>
                ${order.cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
