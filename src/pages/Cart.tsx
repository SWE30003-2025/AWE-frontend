import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Cart() {
  const { cart, loading, error, removeFromCart, updateQuantity, refreshCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  // Check if user is a customer
  const isCustomer = localStorage.getItem("userRole") === "customer";
  const isLoggedIn = localStorage.getItem("userId");

  useEffect(() => {
    if (isLoggedIn && isCustomer) {
      refreshCart();
    }
  }, [isLoggedIn, isCustomer]);

  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (!isCustomer) {
      alert("Only customers can checkout");
      return;
    }
    navigate('/checkout');
  };

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
        <p className="text-gray-500 mb-4">Please log in to view your cart.</p>
        <button 
          onClick={() => navigate('/login')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Log In
        </button>
      </div>
    );
  }

  if (!isCustomer) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
        <p className="text-gray-500">Only customers can access the shopping cart.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
        <p className="text-gray-500">Loading cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
        <button 
          onClick={refreshCart}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
      {!cart || cart.items.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <button 
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.items.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-white shadow rounded-lg p-4">
                <div className="flex-1">
                  <h3 className="font-semibold">{item.product_name}</h3>
                  <p className="text-gray-600">${Number(item.product_price).toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Subtotal: ${Number(item.subtotal).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={e => handleQuantityChange(item.product, parseInt(e.target.value) || 1)}
                    className="border rounded w-16 p-1 mr-4 text-center"
                    disabled={loading}
                  />
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition disabled:opacity-50"
                    onClick={() => handleRemoveItem(item.product)}
                    disabled={loading}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-right">
            <div className="mb-2">
              <p className="text-lg">Items: {cart.total_items}</p>
              <p className="text-xl font-bold">Total: ${Number(cart.total).toFixed(2)}</p>
            </div>
            <button
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
              onClick={handleCheckout}
              disabled={loading}
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
