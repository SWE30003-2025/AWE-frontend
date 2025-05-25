// ================================
// Types and Interfaces
// ================================

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
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

export function getProducts(): Product[] {
  // TODO: For backend: Replace with API call (e.g., axios.get('/api/products/'))
  const products = localStorage.getItem("products");
  return products ? JSON.parse(products) : [];
}

export function saveProducts(products: Product[]): void {
  // TODO: For backend: Replace with API call (e.g., axios.post('/api/products/', products) or PATCH)
  localStorage.setItem("products", JSON.stringify(products));
}

// ================================
// Order APIs
// ================================

export function getOrders(): Order[] {
  // TODO: For backend: Replace with API call (e.g., axios.get('/api/orders/'))
  const orders = localStorage.getItem("orders");
  return orders ? JSON.parse(orders) : [];
}

export function saveOrders(orders: Order[]): void {
  // TODO: For backend: Replace with API call (e.g., axios.post('/api/orders/', orders) or PATCH)
  localStorage.setItem("orders", JSON.stringify(orders));
}

// ================================
// User APIs (frontend only)
// ================================

export function getUser(): User | null {
  // TODO: For backend: Replace with API call (e.g., axios.get('/api/user/'))
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function saveUser(user: User): void {
  // TODO: For backend: Replace with API call (e.g., axios.post('/api/user/', user) or PATCH)
  localStorage.setItem("user", JSON.stringify(user));
}
