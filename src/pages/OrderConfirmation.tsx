import { Link } from "react-router-dom";

export default function OrderConfirmation() {
  return (
    <div className="text-center mt-20">
      <h2 className="text-3xl font-bold text-green-700 mb-4">Thank you for your order!</h2>
      <p>Your order has been placed successfully.</p>
      <Link to="/my-orders" className="inline-block mt-6 bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800">
        View My Orders
      </Link>
    </div>
  );
}
