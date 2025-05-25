import { useState, useEffect } from "react";
import ProductCard from '../components/ProductCard';
import { getProducts, saveProducts } from '../api';

export default function ProductCatalog() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let productsFromStorage = getProducts();
    // If first load, initialize with defaults
    if (productsFromStorage.length === 0) {
      productsFromStorage = [
        {
          id: 1,
          name: "Wireless Mouse",
          description: "Ergonomic wireless mouse with 2.4GHz connectivity.",
          price: 29.99,
          image: "https://source.unsplash.com/featured/?mouse,tech"
        },
        {
          id: 2,
          name: "Mechanical Keyboard",
          description: "RGB backlit mechanical keyboard with blue switches.",
          price: 89.99,
          image: "https://source.unsplash.com/featured/?keyboard,tech"
        },
        {
          id: 3,
          name: "Noise Cancelling Headphones",
          description: "Bluetooth headphones with active noise cancellation.",
          price: 199.99,
          image: "https://source.unsplash.com/featured/?headphones,tech"
        },
      ];
      saveProducts(productsFromStorage);
    }
    setProducts(productsFromStorage);
  }, []);

  // TODO: For backend: Call getProducts() as an async function and setProducts(await getProducts())

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-center">Product Catalog</h2>
      <input
        type="text"
        placeholder="Search products..."
        className="mb-6 w-full p-2 border rounded"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">No products found.</div>
        )}
      </div>
    </div>
  );
}
