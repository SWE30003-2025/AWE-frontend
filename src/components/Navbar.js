import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { cartCount } = useCart();
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const loggedInUser = localStorage.getItem("loggedInUser");
  const navigate = useNavigate();
  const userEmail = JSON.parse(localStorage.getItem("user") || "{}").email;
  const isAdmin = isLoggedIn && userEmail === "admin@awe.com";

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUser");
    toast.success("Logged out!", { duration: 2000 });
    setTimeout(() => {
      window.location.reload();
      navigate("/");
    }, 2000);
  };

  return (
    <nav className="bg-blue-800 p-4 text-white flex gap-8 items-center flex-wrap">
      <Link to="/" className="font-bold text-xl">AWE Electronics</Link>
      <Link to="/catalog" className="hover:underline">Products</Link>
      <Link to="/cart" className="hover:underline">
        Cart
        {cartCount > 0 && (
          <span className="bg-red-600 text-white rounded-full px-2 py-0.5 ml-2 text-xs">
            {cartCount}
          </span>
        )}
      </Link>
      <div className="ml-auto flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <span className="font-semibold hidden sm:inline">Hi, {loggedInUser}</span>
            <Link to="/my-orders" className="hover:underline">My Orders</Link>
            <Link to="/profile" className="hover:underline">Profile</Link>
            {isAdmin && (
              <>
                <Link to="/admin" className="hover:underline">Admin</Link>
                <Link to="/admin-orders" className="hover:underline">All Orders</Link>
              </>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
