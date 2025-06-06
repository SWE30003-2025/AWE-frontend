import { useState, useEffect, FormEvent } from "react";

import toast from "react-hot-toast";

import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  enableProduct, 
  disableProduct, 
  getSalesAnalytics, 
  getCategories 
} from "../../api";

import type { ProductModel } from "../../models/ProductModel";
import type { CategoryModel } from "../../models/CategoryModel";

interface ProductForm {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
    getCategories().then(setCategories);
    getSalesAnalytics().then(setAnalytics).catch(() => setAnalytics(null));
  }, []);

  const fetchProducts = async () => {
    try {
      const allProducts = await getProducts(undefined, true);
      setProducts(allProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.stock || !form.category) return;

    try {
      const newProduct = await createProduct({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
        category: form.category,
      });

      setProducts([...products, newProduct]);

      setForm({ name: "", description: "", price: "", stock: "", category: "" });

      toast.success("Product added!");
    } catch {
      toast.error("Failed to add product");
    }
  };

  const handleEnable = async (id: string) => {
    try {
      const updatedProduct = await enableProduct(id);

      setProducts(products.map(p => p.id === id ? { ...p, ...updatedProduct } : p));

      toast.success("Product enabled!");
    } catch (error) {
      console.error("Error enabling product:", error);

      toast.error("Failed to enable product");

      fetchProducts();
    }
  };

  const handleDisable = async (id: string) => {
    try {
      const updatedProduct = await disableProduct(id);

      setProducts(products.map(p => p.id === id ? { ...p, ...updatedProduct } : p));

      toast.success("Product disabled!");
    } catch (error) {
      console.error("Error disabling product:", error);

      toast.error("Failed to disable product");

      fetchProducts();
    }
  };

  const handleEdit = (product: ProductModel) => {
    setEditingId(product.id);

    const categoryObj = categories.find(cat => cat.name === product.category);

    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock?.toString() ?? "",
      category: categoryObj?.id || "",
    });
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();

    if (!editingId) return;

    try {
      const updatedProduct = await updateProduct(editingId, {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
        category: form.category,
      });

      setProducts(products.map(p => p.id === editingId ? updatedProduct : p));

      setEditingId(null);

      setForm({ name: "", description: "", price: "", stock: "", category: "" });

      toast.success("Product updated!");
    } catch {
      toast.error("Failed to update product");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      
      {analytics && (
        <div className="bg-gray-100 p-4 rounded mb-8 shadow">
          <h3 className="font-semibold mb-2">Sales Analytics</h3>
          
          <div>
            Total Sales: <span className="font-bold">${analytics.summary?.total_revenue?.toFixed(2) || '0.00'}</span>
          </div>

          <div>
            Total Orders: <span className="font-bold">{analytics.summary?.total_orders || 0}</span>
          </div>

          <div className="mt-2">
            <span className="font-semibold">Popular Products:</span>

            <ul className="list-disc ml-6">
              {analytics.top_products && analytics.top_products.length > 0 ? (
                analytics.top_products.map((p: any, idx: number) => (
                  <li key={idx}>{p.product_name} - Sold: {p.total_quantity}</li>
                ))
              ) : (
                <li>No popular products data available</li>
              )}
            </ul>
          </div>
        </div>
      )}

      <form onSubmit={editingId ? handleUpdate : handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded"
            required
          />

          <select
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Category</option>

            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            className="border p-2 rounded"
            step="0.01"
            required
          />

          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={e => setForm({ ...form, stock: e.target.value })}
            className="border p-2 rounded"
            min={0}
            required
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="border p-2 rounded md:col-span-2"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700"
        >
          {editingId ? "Update Product" : "Add Product"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({ name: "", description: "", price: "", stock: "", category: "" });
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2 hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(prod => (
          <div 
            key={prod.id} 
            className={`border rounded p-4 ${!(prod.is_active ?? true) ? "bg-gray-100 opacity-75" : "bg-white"}`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{prod.name}</h3>

              <span
                className={`px-2 py-1 text-xs rounded ${(prod.is_active ?? true) ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {(prod.is_active ?? true) ? "Active" : "Inactive"}
              </span>
            </div>

            <p className="text-gray-600">{prod.description}</p>

            <p className="font-bold text-blue-700">${prod.price}</p>

            <p className="text-gray-800">Stock: {prod.stock}</p>

            <p className="text-gray-600">Category: {prod.category}</p>

            <div className="mt-4 flex gap-2 flex-wrap">
              <button
                onClick={() => handleEdit(prod)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Edit
              </button>

              {(prod.is_active ?? true) ? (
                <button
                  onClick={() => handleDisable(prod.id)}
                  className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-700"
                >
                  Disable
                </button>
              ) : (
                <button
                  onClick={() => handleEnable(prod.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Enable
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
