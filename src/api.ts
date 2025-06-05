import axios from "axios";

import type { CategoryModel } from "./models/CategoryModel";
import type { ProductModel, CreateProductModel, UpdateProductModel } from "./models/ProductModel";
import type { OrderModel } from "./models/OrderModel";
import type { UserModel, CreateUserModel, UpdateUserModel } from "./models/UserModel";
import type { ShipmentDashboardData, ShipmentModel } from "./models/ShipmentModel";
import type { ShoppingCartModel } from "./models/ShoppingCartModel";
import type { CartItemModel } from "./models/CartItemModel";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

// Request interceptor: add basic auth if user is logged in (skip for login/signup)
api.interceptors.request.use(
  (config) => {
    if (
      config.url &&
      (config.url.includes("/signup") || config.url.includes("/login"))
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

export async function getProducts(categories?: string[], includeInactive?: boolean): Promise<ProductModel[]> {
  try {
    let url = "/api/product";
    const queryParams = new URLSearchParams();
    
    if (categories && categories.length > 0) {
      const categoryParams = categories.join(",");

      queryParams.append("categories", categoryParams);
    }
    
    if (includeInactive) {
      queryParams.append("include_inactive", "true");
    }
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
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
    const { category, ...productData } = product;

    const payload = {
      ...productData,
      category_id: category || null
    };

    const response = await api.post("/api/product/", payload);

    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);

    throw error;
  }
}

export async function updateProduct(id: string, product: UpdateProductModel): Promise<ProductModel> {
  try {
    const { category, ...productData } = product;

    const payload = {
      ...productData,
      category_id: category || null
    };

    const response = await api.put(`/api/product/${id}/`, payload);

    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);

    throw error;
  }
}

export async function enableProduct(id: string): Promise<ProductModel> {
  try {
    const response = await api.put(`/api/product/${id}/enable/`);

    return response.data.product;
  } catch (error) {
    console.error("Error enabling product:", error);

    throw error;
  }
}

export async function disableProduct(id: string): Promise<ProductModel> {
  try {
    const response = await api.put(`/api/product/${id}/disable/`);

    return response.data.product;
  } catch (error) {
    console.error("Error disabling product:", error);

    throw error;
  }
}

// ===== Inventory Management APIs =====

export async function updateProductStock(id: string, amount: number): Promise<{
  message: string;
  product: ProductModel;
  new_stock: number;
}> {
  try {
    const response = await api.post(`/api/inventory/${id}/update_stock/`, { amount });

    return response.data;
  } catch (error) {
    console.error("Error updating product stock:", error);

    throw error;
  }
}

export async function getProductsForInventory(includeInactive: boolean = false): Promise<ProductModel[]> {
  try {
    let url = "/api/product";

    if (includeInactive) {
      url += "?include_inactive=true";
    }

    const response = await api.get(url);

    return response.data;
  } catch (error) {
    console.error("Error fetching products for inventory:", error);

    return [];
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
    const response = await api.post("/api/user/login/", { username, password });

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
    const response = await api.post('/api/user/signup/', user);

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
  full_name: string;
  address: string;
  city: string;
  postal_code: string;
}): Promise<OrderModel> {
  try {
    const response = await api.post("/api/shopping-cart/place-order/", shippingInfo);

    return response.data;
  } catch (error) {
    console.error("Error placing order:", error);

    throw error;
  }
}

// ===== Invoice & Payment APIs =====

export async function payInvoice(invoiceId: string): Promise<{
  message: string;
  payment: {
    transaction_id: string;
    amount: string;
    status: string;
  };
  receipt: {
    receipt_number: string;
    amount_paid: string;
  };
  shipment?: {
    tracking_number: string;
    status: string;
    estimated_delivery: string;
  };
}> {
  try {
    const response = await api.post("/api/shopping-cart/pay-invoice/", {
      invoice_id: invoiceId
    });

    return response.data;
  } catch (error) {
    console.error("Error paying invoice:", error);

    throw error;
  }
}

export async function getUserOrders(): Promise<Array<OrderModel & {
  invoice?: {
    id: string;
    invoice_number: string;
    amount_due: string;
    status: string;
    due_date: string;
  };
  receipts?: Array<{
    id: string;
    receipt_number: string;
    amount_paid: string;
    created_at: string;
  }>;
}>> {
  try {
    const response = await api.get("/api/order/");

    return response.data;
  } catch (error) {
    console.error("Error fetching user orders:", error);

    return [];
  }
}

export async function getOrderInvoice(orderId: string): Promise<{
  id: string;
  invoice_number: string;
  amount_due: string;
  status: string;
  due_date: string;
  created_at: string;
} | null> {
  try {
    const response = await api.get(`/api/order/${orderId}/invoice/`);

    return response.data;
  } catch (error) {
    console.error("Error fetching order invoice:", error);

    return null;
  }
}

export async function getOrderReceipts(orderId: string): Promise<Array<{
  id: string;
  receipt_number: string;
  amount_paid: string;
  payment_transaction_id: string;
  created_at: string;
}>> {
  try {
    const response = await api.get(`/api/order/${orderId}/receipts/`);

    return response.data;
  } catch (error) {
    console.error("Error fetching order receipts:", error);

    return [];
  }
}

export async function getUserInvoices(): Promise<Array<{
  id: string;
  invoice_number: string;
  amount_due: string;
  status: string;
  due_date: string;
  created_at: string;
  order: {
    id: string;
    created_at: string;
    shipping_full_name: string;
  };
}>> {
  try {
    const response = await api.get("/api/invoice/my-invoices/");

    return response.data;
  } catch (error) {
    console.error("Error fetching user invoices:", error);

    return [];
  }
}

export async function getUserReceipts(): Promise<Array<{
  id: string;
  receipt_number: string;
  amount_paid: string;
  created_at: string;
  payment: {
    transaction_id: string;
    status: string;
  };
  order: {
    id: string;
    created_at: string;
    shipping_full_name: string;
  };
}>> {
  try {
    const response = await api.get("/api/receipt/my-receipts/");

    return response.data;
  } catch (error) {
    console.error("Error fetching user receipts:", error);

    return [];
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

export async function updateShipmentStatus(shipmentId: string, status: string): Promise<{
  message: string;
  shipment: ShipmentModel;
}> {
  try {
    const response = await api.post(`/api/shipment/${shipmentId}/update-status/`, {
      status
    });

    return response.data;
  } catch (error) {
    console.error("Error updating shipment status:", error);
    
    throw error;
  }
}
