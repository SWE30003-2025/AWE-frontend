import { useState, useEffect } from "react";
import { getProducts, saveProducts } from "../api";
import toast from 'react-hot-toast';

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", image: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  useEffect(() => {
    saveProducts(products);
  }, [products]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    setProducts([
      ...products,
      { ...form, id: Date.now(), price: parseFloat(form.price) }
    ]);
    setForm({ name: "", description: "", price: "", image: "" });
    toast.success("Product added!");
  };

  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success("Product deleted!");
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setProducts(products.map(p => p.id === editingId ? { ...p, ...form, price: parseFloat(form.price) } : p));
    setEditingId(null);
    setForm({ name: "", description: "", price: "", image: "" });
    toast.success("Product updated!");
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: "", description: "", price: "", image: "" });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>
      <form onSubmit={editingId ? handleUpdate : handleAdd} className="mb-8 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <input name="name" placeholder="Name" className="p-2 border rounded" value={form.name} onChange={handleChange} />
        <input name="description" placeholder="Description" className="p-2 border rounded" value={form.description} onChange={handleChange} />
        <input name="price" placeholder="Price" type="number" className="p-2 border rounded" value={form.price} onChange={handleChange} />
        <input name="image" placeholder="Image URL" className="p-2 border rounded" value={form.image} onChange={handleChange} />
        <button
          type="submit"
          className="col-span-1 sm:col-span-4 bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
        >
          {editingId ? "Update Product" : "Add Product"}
        </button>
        {editingId && (
          <button
            type="button"
            className="col-span-1 sm:col-span-4 bg-gray-300 text-gray-800 py-2 rounded mt-2"
            onClick={handleCancel}
          >
            Cancel
          </button>
        )}
      </form>
      <div>
        <h3 className="text-lg font-bold mb-2">Current Products:</h3>
        {products.length === 0 ? (
          <p className="text-gray-500">No products.</p>
        ) : (
          <ul>
            {products.map(prod => (
              <li key={prod.id} className="flex justify-between items-center border-b py-2">
                <span>{prod.name} - ${prod.price}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(prod)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-700"
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
