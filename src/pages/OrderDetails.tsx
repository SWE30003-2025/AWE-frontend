import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrders } from "../api";
import type { OrderModel } from "../models/OrderModel";

export default function OrderDetails() {
  const [order, setOrder] = useState<OrderModel | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrder = async () => {
      const allOrders = await getOrders();
      const found = allOrders.find((o: OrderModel) => o.id === Number(id));
      if (!found) {
        navigate("/my-orders");
        return;
      }
      setOrder(found);
    };
    loadOrder();
  }, [id, navigate]);

  if (!order) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Order Details</h2>
      <div className="border rounded p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">Order #{order.id}</h3>
            <p className="text-gray-600">Customer: {order.user}</p>
            <p className="text-gray-600">Date: {new Date(order.created_at).toLocaleDateString()}</p>
            <p className="text-gray-600">Status: {order.status}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-blue-700">${order.total}</p>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Items:</h4>
          <ul className="space-y-2">
            {order.items.map((item, idx) => {
              const individualPrice = parseFloat(item.price || item.price_at_purchase?.toString() || '0');
              const totalPrice = individualPrice * item.quantity;
              return (
                <li key={idx} className="flex justify-between">
                  <span>{item.product_name}</span>
                  <span>${individualPrice.toFixed(2)} x {item.quantity} = ${totalPrice.toFixed(2)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
