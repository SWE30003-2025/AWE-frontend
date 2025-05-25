import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders, Order } from "../api";

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const loggedInUser = localStorage.getItem("loggedInUser");

  useEffect(() => {
    const allOrders = getOrders();
    // Filter orders for the current user
    const userOrders = allOrders.filter((order: Order) => order.user === loggedInUser);
    setOrders(userOrders);
  }, [loggedInUser]);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">My Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-600 text-center">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order: Order) => (
            <div key={order.id} className="bg-white rounded shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-bold">Order #{order.id}</div>
                  <div className="text-gray-600">Placed on {order.date}</div>
                </div>
                <Link
                  to={`/order/${order.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  View Details
                </Link>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Shipping:</span> {order.shipping.address}, {order.shipping.city}, {order.shipping.postal}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Items:</span>
                <ul className="ml-4">
                  {order.cart.map(item => (
                    <li key={item.id}>{item.name} x {item.quantity}</li>
                  ))}
                </ul>
              </div>
              <div className="font-bold">
                Total: ${order.cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
