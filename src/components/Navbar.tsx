import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { logout } from '../api';

export default function Navbar() {
  const { getCartItemCount, clearCart } = useCart();
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const userRole = localStorage.getItem("userRole");
  const navigate = useNavigate();

  const cartItemCount = getCartItemCount();
  const isLoggedIn = !!userId;

  const handleLogout = () => {
    logout(); // This clears username, password, userRole, and userId
    clearCart(); // Clear local cart state
    navigate("/login");
  };

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
            <Link to="/products" className="text-white hover:text-gray-200">
              Products
            </Link>
            {/* Admin Dashboard link for admin */}
            {isLoggedIn && userRole === "admin" && (
              <>
                <Link to="/admin" className="text-white hover:text-gray-200">
                  Admin Dashboard
                </Link>
                <Link to="/admin-orders" className="text-white hover:text-gray-200">
                  All Orders
                </Link>
                <Link to="/admin-analytics" className="text-white hover:text-gray-200">
                  Sales Analytics
                </Link>
                <Link to="/inventory-management" className="text-white hover:text-gray-200">
                  Inventory Management
                </Link>
                <Link to="/shipment-dashboard" className="text-white hover:text-gray-200">
                  Shipment Dashboard
                </Link>
              </>
            )}

            {isLoggedIn && userRole === "inventory_manager" && (
              <Link to="/inventory-management" className="text-white hover:text-gray-200">
                Inventory Management
              </Link>
            )}


            {isLoggedIn && userRole === "shipment_manager" && (
              <Link to="/shipment-dashboard" className="text-white hover:text-gray-200">
                Shipment Dashboard
              </Link>
            )}


            {isLoggedIn && userRole !== "admin" && userRole !== "shipment_manager" && (
              <Link to="/my-orders" className="text-white hover:text-gray-200">
                My Orders
              </Link>
            )}

            {isLoggedIn && (
              <Link to="/profile" className="text-white hover:text-gray-200">
                Profile
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn && userRole === "customer" && (
              <Link to="/cart" className="text-white hover:text-gray-200 relative">
                <span className="flex items-center">
                  Cart
                  {cartItemCount > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {cartItemCount}
                    </span>
                  )}
                </span>
              </Link>
            )}
            {isLoggedIn ? (
              <>
                <span className="text-white">Welcome, {username}</span>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-gray-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-gray-200">
                  Login
                </Link>
                <Link to="/register" className="text-white hover:text-gray-200">
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
