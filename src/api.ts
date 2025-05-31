import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// ================================
// Types and Interfaces
// ================================

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: number;
  user: string;
  cart: CartItem[];
  shipping: {
    name: string;
    address: string;
    city: string;
    postal: string;
  };
  total: number;
  date: string;
}

export interface User {
  name: string;
  email: string;
  password?: string;
}

// ================================
// Product APIs
// ================================

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await api.get("/api/product");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function createProduct(product: Omit<Product, "id" | "created_at" | "updated_at">): Promise<Product> {
  try {
    const response = await api.post("/api/product", product);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
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

// ================================
// Order APIs
// ================================

export async function getOrders(): Promise<Order[]> {
  try {
    const response = await api.get("/api/order");
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export async function createOrder(order: Omit<Order, "id" | "date">): Promise<Order> {
  try {
    const response = await api.post("/api/order", order);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

// ================================
// User APIs
// ================================

export async function login(email: string, password: string): Promise<{ user: User; token: string }> {
  try {
    const response = await api.post('/api/auth/login/', { email, password });
    const { user, token } = response.data;
    localStorage.setItem('token', token);
    return { user, token };
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export async function register(user: Omit<User, 'id'>): Promise<User> {
  try {
    const response = await api.post('/api/user/signup', user);
    return response.data;
  } catch (error) {
    console.error("Error registering:", error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await api.get('/api/auth/user/');
    return response.data;
  } catch (error) {
      console.error("Error fetching current user:", error);
    return null;
  }
}

export function logout(): void {
  localStorage.removeItem('token');
}

