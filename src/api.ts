import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include credentials
api.interceptors.request.use(
  (config) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    if (username && password) {
      const credentials = btoa(`${username}:${password}`);
      config.headers.Authorization = `Basic ${credentials}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      //localStorage.removeItem("username");
      //localStorage.removeItem("password");

      console.log("Unauthorized");
    }
    return Promise.reject(error);
  }
);

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

export async function login(email: string, password: string): Promise<{ user: User }> {
  try {
    const response = await api.post('/api/auth/login/', { email, password });
    const { user } = response.data;
    
    // Store credentials for future requests
    localStorage.setItem("username", email);
    localStorage.setItem("password", password);
    
    return { user };
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

// admin only
export async function listUsers(): Promise<Array<User>> {
  try {
    const response = await api.get("/api/user");
    console.log(response.data);
    
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export function logout(): void {
  localStorage.removeItem("username");
  localStorage.removeItem("password");
}
