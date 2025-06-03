import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export default function Navbar() {
  const { cart } = useCart();
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const loggedInUser = localStorage.getItem("loggedInUser");
  const userRole = localStorage.getItem("userRole");
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
            <Link to="/catalog" className="text-white hover:text-gray-900">
              Products
            </Link>
            {/* Admin Dashboard link for admin */}
            {isLoggedIn && userRole === "admin" && (
              <>
                <Link to="/admin" className="text-white hover:text-gray-900">
                  Admin Dashboard
                </Link>
                <Link to="/admin-orders" className="text-white hover:text-gray-900">
                  All Orders
                </Link>
                <Link to="/admin-analytics" className="text-white hover:text-gray-900">
                  Sales Analytics
                </Link>
              </>
            )}
            {/* Orders link: users see My Orders */}
            {isLoggedIn && userRole !== "admin" && (
              <Link to="/my-orders" className="text-white hover:text-gray-900">
                My Orders
              </Link>
            )}
            {/* Profile link for logged in users */}
            {isLoggedIn && (
              <Link to="/profile" className="text-white hover:text-gray-900">
                Profile
              </Link>
            )}
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
                    localStorage.removeItem("userRole");
                    localStorage.removeItem("userId");
                    navigate("/login");
                  }}
                  className="text-white hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-gray-900">
                  Login
                </Link>
                <Link to="/register" className="text-white hover:text-gray-900">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
