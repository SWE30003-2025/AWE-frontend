import axios from "axios";
import type { CategoryModel } from './models/CategoryModel';
import type { ProductModel, CreateProductModel, UpdateProductModel } from './models/ProductModel';
import type { OrderModel } from './models/OrderModel';
import type { UserModel, CreateUserModel, UpdateUserModel } from './models/UserModel';
import type { ShipmentDashboardData } from './models/ShipmentModel';
import type { ShoppingCartModel } from './models/ShoppingCartModel';
import type { CartItemModel, CreateCartItemModel, UpdateCartItemModel } from './models/CartItemModel';

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

// Request interceptor: add basic auth if user is logged in (skip for login/signup)
api.interceptors.request.use(
  (config) => {
    if (
      config.url &&
      (config.url.endsWith("/signup") || config.url.endsWith("/login"))
    ) {
      return config;
    }
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    if (username && password) {
      const credentials = btoa(`${username}:${password}`);
      config.headers = config.headers || {};
      config.headers.Authorization = `Basic ${credentials}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized");
    }
    return Promise.reject(error);
  }
);

// ===== Product APIs =====

export async function getCategories(): Promise<CategoryModel[]> {
  try {
    const response = await api.get("/api/category");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getProducts(categories?: string[]): Promise<ProductModel[]> {
  try {
    let url = "/api/product";
    if (categories && categories.length > 0) {
      const categoryParams = categories.join(',');
      url += `?categories=${encodeURIComponent(categoryParams)}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProduct(id: string): Promise<ProductModel> {
  try {
    const response = await api.get(`/api/product/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

export async function createProduct(product: CreateProductModel): Promise<ProductModel> {
  try {
    const response = await api.post("/api/product", product);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

export async function updateProduct(id: string, product: UpdateProductModel): Promise<ProductModel> {
  try {
    const response = await api.put(`/api/product/${id}`, product);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await api.delete(`/api/product/${id}`);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

// ===== Order APIs =====

export async function getOrders(): Promise<OrderModel[]> {
  try {
    const response = await api.get("/api/order");
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

// Analytics (admin only)
export async function getSalesAnalytics(): Promise<{
  total_sales: number;
  total_orders: number;
  popular_products: Array<{ product__name: string; total_sold: number }>;
}> {
  try {
    const response = await api.get("/api/order/analytics/");
    return response.data;
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw error;
  }
}

// ===== User APIs =====

export async function login(username: string, password: string): Promise<{ user: UserModel }> {
  try {
    const response = await api.post('/api/user/login/', { username, password });
    const { user } = response.data;
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
    localStorage.setItem("userRole", user.role ?? "customer");
    localStorage.setItem("userId", user.id);
    return { user };
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export async function register(user: CreateUserModel): Promise<UserModel> {
  try {
    const response = await api.post('/api/user/signup', user);
    return response.data;
  } catch (error) {
    console.error("Error registering:", error);
    throw error;
  }
}

export async function updateUser(id: string, data: UpdateUserModel): Promise<UserModel> {
  try {
    const response = await api.put(`/api/user/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<UserModel | null> {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) return null;
    const response = await api.get(`/api/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

// Admin only
export async function listUsers(): Promise<Array<UserModel>> {
  try {
    const response = await api.get("/api/user");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export function logout(): void {
  localStorage.removeItem("username");
  localStorage.removeItem("password");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userId");
}

// ===== Cart APIs =====

export async function getCart(): Promise<ShoppingCartModel | null> {
  try {
    const response = await api.get("/api/shopping-cart/");
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return null;
  }
}

export async function addToCart(product_id: string, quantity: number = 1): Promise<CartItemModel | null> {
  try {
    const response = await api.post("/api/shopping-cart/", {
      product_id,
      quantity
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
}

export async function updateCartItem(product_id: string, quantity: number): Promise<CartItemModel | null> {
  try {
    const response = await api.put("/api/shopping-cart/", {
      product_id,
      quantity
    });
    return response.data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
}

export async function removeFromCart(product_id: string): Promise<void> {
  try {
    await api.delete("/api/shopping-cart/", {
      data: { product_id }
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
}

export async function placeOrder(shippingInfo: {
  shipping_full_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
}): Promise<OrderModel> {
  try {
    const response = await api.post("/api/shopping-cart/place-order/", shippingInfo);
    return response.data;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
}



// ===== Shipment APIs =====

export async function getShipmentDashboard(): Promise<ShipmentDashboardData> {
  try {
    const response = await api.get("/api/shipment/dashboard/");
    return response.data;
  } catch (error) {
    console.error("Error fetching shipment dashboard:", error);
    throw error;
  }
}
