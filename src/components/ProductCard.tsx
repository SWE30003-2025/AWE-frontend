import { useNavigate } from "react-router-dom";

import type { ProductModel } from "../models/ProductModel";

interface ProductCardProps {
  product: ProductModel;
};

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleShopNowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  return (
    <div 
      className="bg-white shadow rounded-lg p-4 flex flex-col cursor-pointer transform transition-all duration-200 hover:shadow-lg hover:scale-105 hover:bg-gray-50"
      onClick={handleCardClick}
    >
      <h3 className="font-semibold text-lg">
        {product.name}
        </h3>

      <p className="text-gray-600 mt-1">
        {product.description}
      </p>

      <p className="text-sm text-gray-500 mt-1">
        Stock: {product.stock}
      </p>

      <div className="mt-auto">
        <span className="block font-bold text-blue-700">
          ${product.price}
        </span>

        <button
          className="bg-blue-600 text-white px-3 py-1 rounded mt-2 hover:bg-blue-700 transition w-full"
          onClick={handleShopNowClick}
        >
          Shop Now
        </button>

        {product.stock === 0 && (
          <p className="text-red-500 text-sm mt-1">Out of Stock</p>
        )}
      </div>
    </div>
  );
};
