import { useState, useEffect, FormEvent } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct, Product } from '../api';
import toast from 'react-hot-toast';

interface ProductForm {
  name: string;
  description: string;
  price: string;
}

export default function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      const productsData = await getProducts();
      setProducts(productsData);
    };
    loadProducts();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) return;

    try {
      const newProduct = await createProduct({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
      });
      setProducts([...products, newProduct]);
      setForm({ name: "", description: "", price: "" });
      toast.success("Product added!");
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      toast.success("Product deleted!");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
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
      });
      setProducts(products.map(p => p.id === editingId ? updatedProduct : p));
      setEditingId(null);
      setForm({ name: "", description: "", price: "" });
      toast.success("Product updated!");
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      
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
