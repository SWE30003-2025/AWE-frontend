import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductCatalog from './pages/ProductCatalog';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/authentication/Login';
import Register from './pages/authentication/Register';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import OrderDetails from './pages/OrderDetails';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import AllOrders from './pages/dashboards/AllOrders';
import StatisticDashboard from './pages/dashboards/StatisticDashboard'; 
import ShipmentDashboard from './pages/dashboards/ShipmentDashboard';
import InventoryDashboard from './pages/dashboards/InventoryDashboard';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-8">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductCatalog />} />
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
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin-orders" element={<AllOrders />} />
          <Route path="/admin-analytics" element={<StatisticDashboard />} />
          <Route path="/shipment-dashboard" element={<ShipmentDashboard />} />
          <Route path="/inventory-management" element={<InventoryDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
