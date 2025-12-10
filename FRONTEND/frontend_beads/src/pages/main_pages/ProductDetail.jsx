import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllProducts } from "../../api/admin/productApi";

export default function ProductDetail() {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (productId) {
      setSelectedImage(0); // Reset selected image when product changes
      fetchProductDetails();
    }
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const allProducts = await getAllProducts({ isAvailable: true });
      const currentProduct = allProducts.find(p => p.id === productId);
      
      if (currentProduct) {
        setProduct(currentProduct);
        
        // Get related products from same category
        const related = allProducts
          .filter(p => p.id !== productId && p.category === currentProduct.category)
          .slice(0, 4);
        setRelatedProducts(related);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-slate-600">Product not found</p>
      </div>
    );
  }

  const images = product.image_urls && product.image_urls.length > 0 ? product.image_urls : ["/placeholder.svg"];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <button onClick={() => navigate("/shop")} className="text-amber-700 hover:text-amber-800 mb-8 font-medium">
          ← Back to Shop
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="bg-slate-100 rounded-lg overflow-hidden mb-4 aspect-square">
              <img 
                src={images[selectedImage]} 
                alt={product.name} 
                className="w-full h-full object-contain"
                onError={(e) => e.target.src = '/placeholder.svg'}
              />
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx 
                        ? 'border-amber-700 ring-2 ring-amber-200' 
                        : 'border-slate-200 hover:border-amber-400'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} ${idx + 1}`} 
                      className="w-full h-full object-cover"
                      onError={(e) => e.target.src = '/placeholder.svg'}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">{product.name}</h1>
            <span className="text-3xl font-bold text-slate-900 mb-6 block">NPR {product.price}</span>

            <p className="text-slate-600 mb-8">
              {product.description || "A beautiful handcrafted product."}
            </p>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Quantity</label>
                <input
                  type="number"
                  defaultValue="1"
                  min="1"
                  max={product.stock_quantity}
                  className="w-20 px-3 py-2 border border-slate-300 rounded"
                />
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <button 
                onClick={() => alert("Added to cart!")}
                className="w-full px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors text-lg font-medium"
              >
                Add to Cart
              </button>
              <button 
                onClick={() => alert("Added to wishlist!")}
                className="w-full px-6 py-3 border border-amber-700 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors"
              >
                Add to Wishlist
              </button>
            </div>

            <div className="border-t pt-8">
              <h2 className="font-serif font-bold text-lg text-slate-900 mb-4">Details</h2>
              <ul className="space-y-3 text-slate-600">
                <li>
                  <span className="font-medium">Category:</span> {product.category || "N/A"}
                </li>
                <li>
                  <span className="font-medium">Stock:</span> {product.stock_quantity} available
                </li>
                <li>
                  <span className="font-medium">Status:</span> {product.is_available ? "In Stock" : "Out of Stock"}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {relatedProducts.length > 0 ? (
              relatedProducts.map((prod) => (
                <div 
                  key={prod.id} 
                  onClick={() => navigate(`/product/${prod.id}`)}
                  className="bg-slate-50 p-4 rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="bg-slate-200 h-48 rounded mb-4 overflow-hidden">
                    <img 
                      src={prod.image_urls?.[0] || '/placeholder.svg'} 
                      alt={prod.name}
                      className="w-full h-full object-cover"
                      onError={(e) => e.target.src = '/placeholder.svg'}
                    />
                  </div>
                  <h3 className="font-serif font-bold text-slate-900 mb-2">{prod.name}</h3>
                  <p className="text-slate-600">NPR {prod.price}</p>
                </div>
              ))
            ) : (
              // Placeholder if no related products
              [1, 2, 3, 4].map((idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-lg">
                  <div className="bg-slate-200 h-48 rounded mb-4"></div>
                  <h3 className="font-serif font-bold text-slate-900 mb-2">Product {idx}</h3>
                  <p className="text-slate-600">NPR 0.00</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
