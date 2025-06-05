import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct } from "../api";
import type { ProductModel } from "../models/ProductModel";
import { useCart } from "../contexts/CartContext";
import toast from "react-hot-toast";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<ProductModel | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in and is a customer
  const isLoggedIn = !!localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole");
  const isCustomer = userRole === "customer";

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Product ID not found");
        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        const productData = await getProduct(id);
        setProduct(productData);
        setError(null);
      } catch (err) {
        setError("Failed to load product details. Please try again later.");
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast.error("Please log in to add items to your cart");
      navigate("/login");

      return;
    }

    if (!isCustomer) {
      toast.error("Only customers can add items to cart");
      return;
    }

    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      toast.success(`Added ${quantity} item${quantity > 1 ? "s" : ""} to cart!`);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (product && newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleBackToCatalog = () => {
    navigate("/catalog");
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-8">
        <p className="text-gray-600">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={handleBackToCatalog}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto text-center py-8">
        <p className="text-gray-600 mb-4">Product not found</p>
        <button
          onClick={handleBackToCatalog}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={handleBackToCatalog}
          className="text-blue-600 hover:text-blue-800 transition flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Catalog
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-2xl font-bold text-blue-700">${product.price}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Stock</h3>
                <p className="text-gray-600">
                  {product.stock > 0 ? (
                    <span className="text-green-600">{product.stock} items available</span>
                  ) : (
                    <span className="text-red-600">Out of stock</span>
                  )}
                </p>
              </div>

              {isLoggedIn && isCustomer && product.stock > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Quantity</h3>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-20 text-center border border-gray-300 rounded px-2 py-1"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                {!isLoggedIn ? (
                  <button
                    onClick={handleLoginRedirect}
                    className="w-full py-3 px-6 rounded-lg font-semibold transition bg-green-600 text-white hover:bg-green-700"
                  >
                    Please log in to buy this product
                  </button>
                ) : !isCustomer ? (
                  <button
                    disabled
                    className="w-full py-3 px-6 rounded-lg font-semibold bg-gray-300 text-gray-500 cursor-not-allowed"
                  >
                    Only customers can purchase products
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition ${
                      product.stock > 0
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {product.stock > 0 ? `Add ${quantity} to Cart` : 'Out of Stock'}
                  </button>
                )}
              </div>

              <div className="text-sm text-gray-500 space-y-1">
                <p>Category: {product.category}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
