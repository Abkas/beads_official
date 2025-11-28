import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlistStore } from '@/store/useWishlistStore';
import ProductCard from '@/components/ProductCard';

const WishlistPage = () => {
  const items = useWishlistStore((state) => state.items);

  if (items.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-3xl font-serif font-bold mb-4">Your Wishlist is Empty</h1>
        <p className="text-muted-foreground mb-8">
          Save items you love to your wishlist.
        </p>
        <Link to="/products">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Discover Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold mb-2">My Wishlist</h1>
        <p className="text-muted-foreground">
          {items.length} {items.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
