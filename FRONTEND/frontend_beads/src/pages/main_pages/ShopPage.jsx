
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/ui/ProductCard";
import { getAllProducts } from "../../api/admin/productApi";
import { addToCart } from "../../api/cartApi";
import toast from "react-hot-toast";

export default function ShopPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching products with category:", selectedCategory);
      
      const data = await getAllProducts({
        category: selectedCategory === "all" ? null : selectedCategory,
        isAvailable: true, // Only show available products in shop
      });
      
      console.log("Fetched products:", data);
      setProducts(data);
      
      // Extract unique categories if not already set
      if (categories.length === 0) {
        const uniqueCategories = [...new Set(data.map(p => p.category).filter(Boolean))];
        console.log("Extracted categories:", uniqueCategories);
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      console.error("Error details:", error.response?.data);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product.id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart. Please login first.");
    }
  };

  const handleAddToWishlist = (product) => {
    toast.success(`${product.name} added to wishlist!`);
  };

  const filteredProducts = products;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-12">Our Collection</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-50 p-6 rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                    selectedCategory === "all" ? "bg-slate-200 text-slate-900" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                      selectedCategory === cat ? "bg-slate-200 text-slate-900" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mb-4"></div>
                  <p className="text-slate-600">Loading products...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={fetchProducts}
                    className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <p className="text-slate-600 mb-2">No products found</p>
                  <p className="text-sm text-slate-500">Try selecting a different category</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      discount_price: product.discount_price,
                      category: product.category,
                      image: product.image_urls?.[0] || "/placeholder.svg",
                      description: product.description
                    }}
                    onViewDetail={() => navigate(`/product/${product.id}`)}
                    onAddToCart={() => handleAddToCart({
                      id: product.id,
                      name: product.name
                    })}
                    onAddToWishlist={() => handleAddToWishlist({
                      id: product.id,
                      name: product.name
                    })}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
