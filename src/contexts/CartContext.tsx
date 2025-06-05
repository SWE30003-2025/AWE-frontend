import { createContext, useContext, useState, useEffect, ReactNode } from "react";

import type { ProductModel } from "../models/ProductModel";
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
};

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

  const refreshCart = async () => {
    await loadCart();
  };

  const addToCart = async (product: ProductModel, quantity: number = 1) => {
    if (!isLoggedInCustomer()) {
      setError("You must be logged in as a customer to add items to cart");

      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.addToCart(product.id, quantity);
      await loadCart();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to add item to cart");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!isLoggedInCustomer()) {
      setError("You must be logged in as a customer to remove items from cart");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.removeFromCart(productId);
      await loadCart();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to remove item from cart");
      throw err;
    } finally {
      setLoading(false);
    }
  };

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
      await loadCart();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update item quantity");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCart(null);
    setError(null);
  };

  const getCartItemCount = (): number => {
    return cart?.total_items || 0;
  };

  const getCartTotal = (): number => {
    return cart?.total || 0;
  };

  useEffect(() => {
    const checkAuthState = () => {
      const currentUserId = localStorage.getItem("userId");
      const currentUserRole = localStorage.getItem("userRole");
      
      if (currentUserId !== userId || currentUserRole !== userRole) {
        setUserId(currentUserId);
        setUserRole(currentUserRole);
      }
    };

    checkAuthState();

    const authCheckInterval = setInterval(checkAuthState, 500);

    return () => clearInterval(authCheckInterval);
  }, [userId, userRole]);

  useEffect(() => {
    loadCart();
  }, [userId, userRole]);

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
};

export function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
};
