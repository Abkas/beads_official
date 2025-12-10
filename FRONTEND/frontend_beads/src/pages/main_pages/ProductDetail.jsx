import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getAllProducts } from "../../api/admin/productApi";
import { Heart, ShoppingCart, TruckIcon, ShieldCheck, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ProductDetail() {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

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

  const handleAddToCart = () => {
    toast.success(`${product.name} added to cart!`);
  };

  const handleAddToWishlist = () => {
    toast.success(`${product.name} added to wishlist!`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link 
          to="/shop" 
          className="inline-flex items-center gap-2 text-slate-600 hover:text-amber-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-slate-100 rounded-lg overflow-hidden aspect-square border border-slate-200">
              <img 
                src={images[selectedImage]} 
                alt={product.name} 
                className="w-full h-full object-cover"
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

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <span className="inline-block px-3 py-1 text-sm font-medium bg-amber-100 text-amber-800 rounded-full mb-3 uppercase">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2 text-slate-900">
                {product.name}
              </h1>
              <p className="text-slate-600">
                {product.description || "A beautiful handcrafted product."}
              </p>
            </div>

            <div className="text-3xl font-bold text-amber-700">
              NPR {product.price}
            </div>

            {product.is_available ? (
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                In Stock
              </span>
            ) : (
              <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                Out of Stock
              </span>
            )}

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock_quantity, parseInt(e.target.value) || 1)))}
                min="1"
                max={product.stock_quantity}
                className="w-24 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <span className="ml-3 text-sm text-slate-600">
                {product.stock_quantity} available
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleAddToCart}
                disabled={!product.is_available}
                className="flex-1 sm:flex-initial px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors text-lg font-medium inline-flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>
              <button 
                onClick={handleAddToWishlist}
                className="px-6 py-3 border-2 border-amber-700 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors inline-flex items-center gap-2"
              >
                <Heart className="h-5 w-5" />
                Save
              </button>
            </div>

            {/* Delivery Info Card */}
            <div className="p-6 space-y-4 bg-amber-50/50 rounded-lg border border-amber-100">
              <div className="flex items-start gap-3">
                <TruckIcon className="h-5 w-5 text-amber-700 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1 text-slate-900">Fast Delivery within Nepal</h3>
                  <p className="text-sm text-slate-600">
                    We deliver across all provinces. Estimated delivery: 2-5 business days.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-amber-700 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1 text-slate-900">Cash on Delivery Available</h3>
                  <p className="text-sm text-slate-600">
                    Pay when you receive your order. No advance payment required.
                  </p>
                </div>
              </div>
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
