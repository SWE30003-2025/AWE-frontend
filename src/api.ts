import axios from "axios";

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

// ===== Types =====

export interface Category {
  id: string;
  name: string;
  description: string;
  parentCategory: string | null;
  parent_name?: string;
  children: Category[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderItem {
  product_id: string; // PK
  product_name: string;
  quantity: number;
  price_at_purchase: number;
}

export interface Order {
  id: number;
  user: string;
  created_at: string;
  status?: string;
  total: number;
  items: OrderItem[];
}


export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role?: string;
}

// ===== Product APIs =====

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await api.get("/api/category");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getProducts(categories?: string[]): Promise<Product[]> {
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

// ===== Order APIs =====

export async function getOrders(): Promise<Order[]> {
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

export async function login(username: string, password: string): Promise<{ user: User }> {
  try {
    const response = await api.post('/api/user/login', { username, password });
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

export async function register(user: Omit<User, 'id'>): Promise<User> {
  try {
    const response = await api.post('/api/user/signup', user);
    return response.data;
  } catch (error) {
    console.error("Error registering:", error);
    throw error;
  }
}

export async function updateUser(id: string, data: Partial<User> & { password?: string }): Promise<User> {
  try {
    const response = await api.put(`/api/user/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<User | null> {
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
export async function listUsers(): Promise<Array<User>> {
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
