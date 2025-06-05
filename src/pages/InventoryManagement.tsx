import { useEffect, useState } from "react";
import { getProductsForInventory, updateProductStock } from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import type { ProductModel } from "../models/ProductModel";

interface StockUpdateForm {
  productId: string;
  amount: number;
  reason: string;
}

export default function InventoryManagement() {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(null);
  const [stockForm, setStockForm] = useState<StockUpdateForm>({
    productId: "",
    amount: 0,
    reason: ""
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    const isLoggedIn = localStorage.getItem("userId");

    if (!isLoggedIn) {
      toast.error("Please log in to access this page");
      navigate("/login");
      return;
    }

    if (userRole !== "admin" && userRole !== "inventory_manager") {
      toast.error("You don't have permission to access this page");
      navigate("/");
      return;
    }

    fetchProducts();
  }, [navigate, showInactive]);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, showInactive]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProductsForInventory(showInactive);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (!showInactive) {
      filtered = filtered.filter(product => product.is_active);
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const openStockModal = (product: ProductModel) => {
    setSelectedProduct(product);
    setStockForm({
      productId: product.id,
      amount: 0,
      reason: ""
    });
    setIsModalOpen(true);
  };

  const closeStockModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setStockForm({
      productId: "",
      amount: 0,
      reason: ""
    });
  };

  const handleStockUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || stockForm.amount === 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      const result = await updateProductStock(stockForm.productId, stockForm.amount);
      
      setProducts(products.map(product => 
        product.id === stockForm.productId 
          ? { ...product, stock: result.new_stock }
          : product
      ));
      
      toast.success(result.message);
      closeStockModal();
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update stock');
    }
  };

  const getStockStatusColor = (stock: number) => {
    if (stock === 0) return "bg-red-100 text-red-800";
    if (stock < 10) return "bg-orange-100 text-orange-800";
    if (stock < 50) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getStockStatusText = (stock: number) => {
    if (stock === 0) return "Out of Stock";
    if (stock < 10) return "Low Stock";
    if (stock < 50) return "Medium Stock";
    return "In Stock";
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading inventory...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-600 mt-2">Manage product stock levels and track inventory</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Show inactive products</span>
            </label>
            <div className="text-sm text-gray-600">
              Total Products: {filteredProducts.length}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className={`bg-white rounded-lg shadow-lg overflow-hidden ${!product.is_active ? 'opacity-75' : ''}`}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                <div className="flex flex-col gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStockStatusColor(product.stock || 0)}`}>
                    {getStockStatusText(product.stock || 0)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">Category: {product.category}</p>
                <p className="text-sm text-gray-600">Price: ${product.price}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Stock:</span>
                  <span className={`font-bold text-lg ${(product.stock || 0) < 10 ? 'text-red-600' : 'text-green-600'}`}>
                    {product.stock || 0}
                  </span>
                </div>
              </div>

              <button
                onClick={() => openStockModal(product)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Update Stock
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No products found</div>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
        </div>
      )}

      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Update Stock for {selectedProduct.name}</h2>
            
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">Current Stock: <span className="font-bold">{selectedProduct.stock}</span></div>
              <div className="text-sm text-gray-600">Category: {selectedProduct.category}</div>
              <div className="text-sm text-gray-600">Price: ${selectedProduct.price}</div>
            </div>

            <form onSubmit={handleStockUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Adjustment Amount
                </label>
                <input
                  type="number"
                  value={stockForm.amount}
                  onChange={(e) => setStockForm({...stockForm, amount: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter positive or negative number"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use positive numbers to add stock, negative to reduce stock
                </p>
                {stockForm.amount !== 0 && (
                  <p className="text-sm mt-1">
                    New stock will be: <span className={`font-bold ${(selectedProduct.stock || 0) + stockForm.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {Math.max(0, (selectedProduct.stock || 0) + stockForm.amount)}
                    </span>
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason (Optional)
                </label>
                <textarea
                  value={stockForm.reason}
                  onChange={(e) => setStockForm({...stockForm, reason: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Enter reason for stock adjustment..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeStockModal}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 
