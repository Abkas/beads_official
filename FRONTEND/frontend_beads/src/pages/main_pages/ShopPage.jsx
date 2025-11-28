
import { useState } from "react";
import ProductCard from "../../components/ui/ProductCard";

export default function ShopPage({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const products = [
    { id: 1, name: "Amethyst Dream", price: 24.99, category: "gemstone", image: "/amethyst-bracelet.jpg" },
    { id: 2, name: "Ocean Breeze", price: 19.99, category: "gemstone", image: "/turquoise-bracelet.jpg" },
    { id: 3, name: "Forest Serenity", price: 22.99, category: "gemstone", image: "/green-jade-bracelet.jpg" },
    { id: 4, name: "Rose Petal", price: 21.99, category: "gemstone", image: "/rose-quartz-bracelet.jpg" },
    { id: 5, name: "Beaded Nature", price: 18.99, category: "wood", image: "/wooden-beaded-bracelet.jpg" },
    { id: 6, name: "Boho Vibes", price: 25.99, category: "leather", image: "/bohemian-leather-bracelet.jpg" },
  ];

  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((p) => p.category === selectedCategory);

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
                {[
                  { id: "all", label: "All Products" },
                  { id: "gemstone", label: "Gemstone" },
                  { id: "wood", label: "Wooden" },
                  { id: "leather", label: "Leather" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                      selectedCategory === cat.id ? "bg-slate-200 text-slate-900" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetail={() => onNavigate("product-detail")}
                  onAddToCart={() => alert("Added to cart!")}
                  onAddToWishlist={() => alert("Added to wishlist!")}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
