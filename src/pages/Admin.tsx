import { useState, useEffect, FormEvent } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct, getSalesAnalytics } from '../api';
import type { ProductModel } from '../models/ProductModel';
import toast from 'react-hot-toast';

interface ProductForm {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
}

export default function Admin() {
  const [products, setProducts] = useState<ProductModel[]>([]);
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
    getProducts().then(setProducts);
    getSalesAnalytics().then(setAnalytics).catch(() => setAnalytics(null));
  }, []);

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

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      toast.success("Product deleted!");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleEdit = (product: ProductModel) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock?.toString() ?? "",
      category: product.category,
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
          <div>Total Sales: <span className="font-bold">${analytics.total_sales?.toFixed(2)}</span></div>
          <div>Total Orders: <span className="font-bold">{analytics.total_orders}</span></div>
          <div className="mt-2">
            <span className="font-semibold">Popular Products:</span>
            <ul className="list-disc ml-6">
              {analytics.popular_products && analytics.popular_products.length > 0 ? (
                analytics.popular_products.map((p: any, idx: number) => (
                  <li key={idx}>{p.product__name} - Sold: {p.total_sold}</li>
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
          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            className="border p-2 rounded"
            required
          />
        </div>
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="border p-2 rounded w-full mt-4"
          rows={3}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700"
        >
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(prod => (
          <div key={prod.id} className="border rounded p-4">
            <h3 className="font-semibold">{prod.name}</h3>
            <p className="text-gray-600">{prod.description}</p>
            <p className="font-bold text-blue-700">${prod.price}</p>
            <p className="text-gray-800">Stock: {prod.stock}</p>
            <p className="text-gray-600">Category: {prod.category}</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleEdit(prod)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(prod.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
