// ================================
// Product APIs
// ================================

export function getProducts() {
  // TODO: For backend: Replace with API call (e.g., axios.get('/api/products/'))
  return JSON.parse(localStorage.getItem("products")) || [];
}

export function saveProducts(products) {
  // TODO: For backend: Replace with API call (e.g., axios.post('/api/products/', products) or PATCH)
  localStorage.setItem("products", JSON.stringify(products));
}

// ================================
// Order APIs
// ================================

export function getOrders() {
  // TODO: For backend: Replace with API call (e.g., axios.get('/api/orders/'))
  return JSON.parse(localStorage.getItem("orders")) || [];
}

export function saveOrders(orders) {
  // TODO: For backend: Replace with API call (e.g., axios.post('/api/orders/', orders) or PATCH)
  localStorage.setItem("orders", JSON.stringify(orders));
}

// ================================
// User APIs (frontend only)
// ================================

export function getUser() {
  // TODO: For backend: Replace with API call (e.g., axios.get('/api/user/'))
  return JSON.parse(localStorage.getItem("user")) || null;
}

export function saveUser(user) {
  // TODO: For backend: Replace with API call (e.g., axios.post('/api/user/', user) or PATCH)
  localStorage.setItem("user", JSON.stringify(user));
}
