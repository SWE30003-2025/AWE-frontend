import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { cart } = useCart();
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const loggedInUser = localStorage.getItem("loggedInUser");
  const navigate = useNavigate();

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-blue-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-white">
              AWE Shop
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="text-white hover:text-gray-900 relative">
              Cart ({cartItemCount})
            </Link>
            {isLoggedIn ? (
              <>
                <span className="text-white">Welcome, {loggedInUser}</span>
                <button
                  onClick={() => {
                    localStorage.removeItem("isLoggedIn");
                    localStorage.removeItem("loggedInUser");
                    navigate("/login");
                  }}
                  className="text-white hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="text-white hover:text-gray-900">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
