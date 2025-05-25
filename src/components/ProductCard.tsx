import { useCart } from '../contexts/CartContext';
import { Product } from '../api';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white shadow rounded-lg p-4 flex flex-col">
      <img src={product.image} alt={product.name} className="h-32 object-contain mb-4" />
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-gray-600 mt-1">{product.description}</p>
      <div className="mt-auto">
        <span className="block font-bold text-blue-700">${product.price}</span>
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded mt-2 hover:bg-blue-700 transition"
          onClick={() => {
            addToCart(product);
            toast.success("Added to cart!");
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
