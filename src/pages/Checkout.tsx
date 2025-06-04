import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { cart, clearCart, loading, error, refreshCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    postal: ''
  });

  // Check if user is a customer
  const isCustomer = localStorage.getItem("userRole") === "customer";
  const isLoggedIn = localStorage.getItem("userId");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (!isCustomer) {
      navigate('/');
      toast.error("Only customers can checkout");
      return;
    }
    if (cart && cart.items.length === 0) {
      navigate('/cart');
      return;
    }
  }, [cart, navigate, isLoggedIn, isCustomer]);

  useEffect(() => {
    if (isLoggedIn && isCustomer) {
      refreshCart();
    }
  }, [isLoggedIn, isCustomer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cart || cart.items.length === 0) {
      toast.error("Your cart is empty");
      navigate('/cart');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        shipping: {
          name: form.name,
          address: form.address,
          city: form.city,
          postal: form.postal,
        },
        items: cart.items.map(item => ({
          product_id: item.product,
          quantity: item.quantity,
        }))
      };

      await axios.post('http://localhost:8000/api/order/', orderPayload, {
        headers: {
          'Authorization': `Basic ${btoa(`${localStorage.getItem("username")}:${localStorage.getItem("password")}`)}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success('Order placed successfully!');
      clearCart();
      navigate('/order-confirmation');
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.error || 'Failed to place order. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold mb-6">Checkout</h2>
        <p className="text-gray-500">Please log in to checkout.</p>
      </div>
    );
  }

  if (!isCustomer) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold mb-6">Checkout</h2>
        <p className="text-gray-500">Only customers can checkout.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold mb-6">Checkout</h2>
        <p className="text-gray-500">Loading cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Checkout</h2>
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

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold mb-6">Checkout</h2>
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <button 
          onClick={() => navigate('/products')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
              disabled={isSubmitting}
            />
            <input
              type="text"
              placeholder="Address"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              className="w-full p-2 border rounded"
              required
              disabled={isSubmitting}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="City"
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                className="w-full p-2 border rounded"
                required
                disabled={isSubmitting}
              />
              <input
                type="text"
                placeholder="Postal Code"
                value={form.postal}
                onChange={e => setForm({ ...form, postal: e.target.value })}
                className="w-full p-2 border rounded"
                required
                disabled={isSubmitting}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="bg-white shadow rounded-lg p-4">
            {cart.items.map(item => (
              <div key={item.id} className="flex justify-between py-2 border-b">
                <span>{item.product_name} x {item.quantity}</span>
                <span>${Number(item.subtotal).toFixed(2)}</span>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Items ({cart.total_items}):</span>
                <span>${Number(cart.total).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${Number(cart.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
