import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const found = allOrders.find(o => o.id === Number(id));
    if (!found) {
      // If not found, redirect or show a message
      navigate("/my-orders");
    } else {
      setOrder(found);
    }
  }, [id, navigate]);

  if (!order) {
    return <div className="text-center mt-20">Loading order details...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Order Details</h2>
      <div className="mb-4">
        <span className="font-semibold">Order ID:</span> {order.id}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Order Date:</span> {order.date}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Shipping Address:</span> {order.shipping.address}, {order.shipping.city}, {order.shipping.postal}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Items:</span>
        <ul className="ml-4">
          {order.cart.map(item => (
            <li key={item.id}>{item.name} x {item.quantity} (${item.price} each)</li>
          ))}
        </ul>
      </div>
      <div className="mb-4 font-bold text-lg">
        Total: ${order.cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
      </div>
      <Link to="/my-orders" className="inline-block mt-4 bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800">
        Back to My Orders
      </Link>
    </div>
  );
}
