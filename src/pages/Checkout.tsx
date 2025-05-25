import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { getOrders, saveOrders, Order } from "../api";
import toast from 'react-hot-toast';

interface ShippingForm {
  address: string;
  city: string;
  postal: string;
}

export default function Checkout() {
  const { cart, updateQuantity } = useCart();
  const [form, setForm] = useState<ShippingForm>({ address: "", city: "", postal: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // Clear cart function
  const clearCart = () => {
    cart.forEach(item => updateQuantity(item.id, 0));
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  if (cart.length === 0) {
    return <div className="text-center mt-20 text-red-600">Your cart is empty!</div>;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.address || !form.city || !form.postal) {
      setError("Please fill in all fields.");
      return;
    }
    // Save order to localStorage (mock order list)
    const orders = getOrders();
    const user = localStorage.getItem("loggedInUser") || "Guest";
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newOrder: Order = {
      id: Date.now(),
      user,
      cart,
      shipping: { name: user, ...form },
      total,
      date: new Date().toLocaleString(),
    };
    saveOrders([newOrder, ...orders]);
    clearCart(); // clear cart
    toast.success("Order placed successfully!");
    navigate("/order-confirmation");
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center">Checkout</h2>
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="address"
          placeholder="Street Address"
          className="w-full p-2 border rounded"
          value={form.address}
          onChange={handleChange}
        />
        <input
          name="city"
          placeholder="City"
          className="w-full p-2 border rounded"
          value={form.city}
          onChange={handleChange}
        />
        <input
          name="postal"
          placeholder="Postal Code"
          className="w-full p-2 border rounded"
          value={form.postal}
          onChange={handleChange}
        />
        <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition">
          Place Order
        </button>
      </form>
    </div>
  );
}
