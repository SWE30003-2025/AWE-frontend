import { useState, useEffect } from "react";
import { getOrders, Order } from "../api";
import { Link } from "react-router-dom";

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const loggedInUser = localStorage.getItem("loggedInUser");

  useEffect(() => {
    const loadOrders = async () => {
      const allOrders = await getOrders();
      const userOrders = allOrders.filter((order: Order) => order.user === loggedInUser);
      setOrders(userOrders);
    };
    loadOrders();
  }, [loggedInUser]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-600 text-center">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="border rounded p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Order #{order.id}</h3>
                  <p className="text-gray-600">Date: {new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-700">${order.total}</p>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Items:</h4>
                <ul className="space-y-2">
                  {order.cart.map(item => (
                    <li key={item.id} className="flex justify-between">
                      <span>{item.name} x {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Shipping:</h4>
                <p>{order.shipping.name}</p>
                <p>{order.shipping.address}</p>
                <p>{order.shipping.city}, {order.shipping.postal}</p>
              </div>
              <div className="mt-4">
                <Link
                  to={`/order/${order.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
