import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { products } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { toast } from 'sonner';
import ProductCard from '@/components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);

  const addToCart = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  if (!product) {
    return (
      <div className="container-custom py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Button onClick={() => navigate('/products')}>Back to Products</Button>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success('Added to cart');
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  return (
    <div className="container-custom py-12">
      {/* Back Button */}
      <Button variant="ghost" className="mb-8" onClick={() => navigate('/products')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Button>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Product Image */}
        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
            <h1 className="text-4xl font-serif font-bold mb-4">{product.name}</h1>
            <p className="text-3xl font-semibold text-foreground">${product.price}</p>
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Materials */}
          <div>
            <h3 className="font-semibold mb-2">Materials</h3>
            <div className="flex flex-wrap gap-2">
              {product.materials.map((material) => (
                <span key={material} className="px-3 py-1 bg-secondary rounded-full text-sm">
                  {material}
                </span>
              ))}
            </div>
          </div>

          {/* Stock Status */}
          {!product.inStock && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-destructive font-medium">Currently out of stock</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>

            <Button size="lg" variant="outline" className="w-full" onClick={handleWishlistToggle}>
              <Heart className={`mr-2 h-5 w-5 ${inWishlist ? 'fill-primary text-primary' : ''}`} />
              {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </Button>
          </div>

          {/* Additional Info */}
          <div className="border-t border-border pt-6 space-y-3 text-sm text-muted-foreground">
            <p>✓ Free shipping on orders over $200</p>
            <p>✓ Lifetime guarantee on all pieces</p>
            <p>✓ 30-day returns & exchanges</p>
            <p>✓ Ethically sourced materials</p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-3xl font-serif font-bold mb-8 text-center">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
