import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductCatalog from './pages/ProductCatalog';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import OrderDetails from './pages/OrderDetails';
import Admin from './pages/Admin';
import AdminOrders from './pages/AdminOrders';
import AdminAnalytics from './pages/AdminAnalytics'; // <-- ADD THIS
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-8">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<ProductCatalog />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/order/:id" element={<OrderDetails />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin-orders" element={<AdminOrders />} />
          <Route path="/admin-analytics" element={<AdminAnalytics />} /> {/* Fix: import this component */}
        </Routes>
      </div>
    </Router>
  );
}
export default App;
