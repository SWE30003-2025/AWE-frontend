import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { ProductModel } from "../models/ProductModel";
import type { CartItemModel } from "../models/CartItemModel";
import type { ShoppingCartModel } from "../models/ShoppingCartModel";
import * as api from "../api";

interface CartContextType {
  cart: ShoppingCartModel | null;
  loading: boolean;
  error: string | null;
  addToCart: (product: ProductModel, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
  getCartItemCount: () => number;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ShoppingCartModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Track authentication state
  const [userId, setUserId] = useState<string | null>(localStorage.getItem("userId"));
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem("userRole"));

  // Check if user is logged in and is a customer
  const isLoggedInCustomer = () => {
    return userId && userRole === "customer";
  };

  // Load cart from server
  const loadCart = async () => {
    if (!isLoggedInCustomer()) {
      setCart(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const cartData = await api.getCart();
      setCart(cartData);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load cart");
      console.error("Error loading cart:", err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh cart
  const refreshCart = async () => {
    await loadCart();
  };

  // Add item to cart
  const addToCart = async (product: ProductModel, quantity: number = 1) => {
    if (!isLoggedInCustomer()) {
      setError("You must be logged in as a customer to add items to cart");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.addToCart(product.id, quantity);
      await loadCart(); // Refresh cart after adding
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to add item to cart");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId: string) => {
    if (!isLoggedInCustomer()) {
      setError("You must be logged in as a customer to remove items from cart");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.removeFromCart(productId);
      await loadCart(); // Refresh cart after removing
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to remove item from cart");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update quantity
  const updateQuantity = async (productId: string, quantity: number) => {
    if (!isLoggedInCustomer()) {
      setError("You must be logged in as a customer to update cart");
      return;
    }

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.updateCartItem(productId, quantity);
      await loadCart(); // Refresh cart after updating
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update item quantity");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear cart (local only)
  const clearCart = () => {
    setCart(null);
    setError(null);
  };

  // Get total item count
  const getCartItemCount = (): number => {
    return cart?.total_items || 0;
  };

  // Get cart total price
  const getCartTotal = (): number => {
    return cart?.total || 0;
  };

  // Check for authentication changes and update state
  useEffect(() => {
    const checkAuthState = () => {
      const currentUserId = localStorage.getItem("userId");
      const currentUserRole = localStorage.getItem("userRole");
      
      if (currentUserId !== userId || currentUserRole !== userRole) {
        setUserId(currentUserId);
        setUserRole(currentUserRole);
      }
    };

    // Check immediately
    checkAuthState();

    // Set up polling to check for auth state changes
    const authCheckInterval = setInterval(checkAuthState, 500);

    return () => clearInterval(authCheckInterval);
  }, [userId, userRole]);

  // Load cart when authentication state changes
  useEffect(() => {
    loadCart();
  }, [userId, userRole]);

  // Listen for storage changes from other windows/tabs
  useEffect(() => {
    const handleStorageChange = () => {
      const newUserId = localStorage.getItem("userId");
      const newUserRole = localStorage.getItem("userRole");
      setUserId(newUserId);
      setUserRole(newUserRole);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        loading, 
        error, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        refreshCart,
        getCartItemCount,
        getCartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
} 

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
