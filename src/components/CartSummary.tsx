import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

interface CartSummaryProps {
  className?: string;
}

export default function CartSummary({ className = "" }: CartSummaryProps) {
  const { cart, loading, error, getCartItemCount, getCartTotal } = useCart();
  const navigate = useNavigate();

  const isCustomer = localStorage.getItem("userRole") === "customer";
  const isLoggedIn = localStorage.getItem("userId");

  if (!isLoggedIn || !isCustomer) {
    return null;
  }

  if (loading) {
    return (
      <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
        <p className="text-gray-500">Loading cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
        <p className="text-red-500">Error loading cart</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
        <p className="text-gray-500">Your cart is empty</p>
        <button 
          onClick={() => navigate('/products')}
          className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
        >
          Start shopping →
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
      <h3 className="font-semibold mb-3">Cart Summary</h3>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {cart.items.slice(0, 3).map(item => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="truncate flex-1 mr-2">{item.product_name}</span>
            <span className="text-gray-600">{item.quantity}x</span>
            <span className="font-medium">${Number(item.subtotal).toFixed(2)}</span>
          </div>
        ))}
        {cart.items.length > 3 && (
          <p className="text-sm text-gray-500">
            +{cart.items.length - 3} more items...
          </p>
        )}
      </div>
      <div className="border-t pt-3 mt-3">
        <div className="flex justify-between font-semibold">
          <span>Total ({getCartItemCount()} items):</span>
          <span>${Number(getCartTotal()).toFixed(2)}</span>
        </div>
        <button 
          onClick={() => navigate('/cart')}
          className="w-full mt-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          View Cart
        </button>
      </div>
    </div>
  );
} 
