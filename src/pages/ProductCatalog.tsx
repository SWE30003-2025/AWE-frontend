import { useState, useEffect, useRef } from "react";
import ProductCard from '../components/ProductCard';
import { getProducts, Product, getCategories, Category } from '../api';

export default function ProductCatalog() {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products whenever categories selection changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsData = await getProducts(selectedCategories.length > 0 ? selectedCategories : undefined);
        setProducts(productsData);
        setError(null);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategories]);

  // Filter products by search text (client-side filtering for search)
  const filteredProducts = products.filter((product: Product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const clearAllCategories = () => {
    setSelectedCategories([]);
  };

  const getSelectedCategoryNames = () => {
    return selectedCategories.map(id => {
      const category = categories.find(cat => cat.id === id);
      return category ? category.name : id;
    });
  };

  // Handle clicking outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading && selectedCategories.length === 0) {
    return (
      <div className="max-w-5xl mx-auto text-center py-8">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto text-center py-8 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-center">Product Catalog</h2>
      
      {/* Search and Filter Controls */}
      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full p-2 border rounded"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        
        {/* Multi-select Category Filter */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="p-2 border rounded cursor-pointer bg-white flex justify-between items-center"
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <span className="text-gray-700">
              {selectedCategories.length === 0 
                ? "Select Categories" 
                : `${selectedCategories.length} categories selected`}
            </span>
            <svg 
              className={`w-4 h-4 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {showCategoryDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="p-2 hover:bg-gray-100 flex items-center cursor-pointer"
                  onClick={() => handleCategoryToggle(category.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => {}} // Handled by onClick
                    className="mr-2"
                  />
                  <span>{category.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Selected Categories Display and Controls */}
        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600">Selected:</span>
            {getSelectedCategoryNames().map((name, index) => (
              <span
                key={selectedCategories[index]}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm flex items-center"
              >
                {name}
                <button
                  onClick={() => handleCategoryToggle(selectedCategories[index])}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
            <button
              onClick={clearAllCategories}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Loading indicator for category filter changes */}
      {loading && (
        <div className="text-center text-gray-600 mb-4">
          <p>Loading products...</p>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            {selectedCategories.length > 0 || search ? "No products found matching your criteria." : "No products found."}
          </div>
        )}
      </div>
      
      {/* Results count */}
      <div className="mt-4 text-center text-gray-600">
        Showing {filteredProducts.length} products
        {selectedCategories.length > 0 && (
          <span> (filtered by {selectedCategories.length} categories)</span>
        )}
      </div>
    </div>
  );
}
