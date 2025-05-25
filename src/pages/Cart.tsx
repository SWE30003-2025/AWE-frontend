import { useCart } from '../contexts/CartContext';
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-3xl font-semibold mb-6 text-center">Shopping Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500 text-center">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cart.map(item => (
            <div key={item.id} className="flex items-center justify-between bg-white shadow rounded-lg p-4">
              <img src={item.image} alt={item.name} className="h-16 w-16 object-contain rounded" />
              <div className="flex-1 ml-4">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">${item.price}</p>
              </div>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={e => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                className="border rounded w-16 p-1 mr-4 text-center"
              />
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="text-right text-lg font-bold">
            Total: ${total.toFixed(2)}
          </div>
          <button
            onClick={() => isLoggedIn ? navigate('/checkout') : navigate('/login')}
            className={`w-full py-2 rounded mt-4 transition 
              ${isLoggedIn ? 'bg-blue-700 text-white hover:bg-blue-800' : 'bg-gray-400 text-white cursor-not-allowed'}`}
            disabled={!isLoggedIn}
          >
            {isLoggedIn ? "Proceed to Checkout" : "Login to Checkout"}
          </button>
        </div>
      )}
    </div>
  );
}
