import React from 'react';

const ProductCard = ({ product, onViewDetail, onAddToCart, onAddToWishlist }) => {
  return (
    <div 
      onClick={() => onViewDetail && onViewDetail(product)}
      className="group rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer"
      style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
        <img
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = '/placeholder.svg';
          }}
        />
        
        {/* Wishlist Icon - Top Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToWishlist && onAddToWishlist(product);
          }}
          className="absolute top-3 right-3 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
          title="Add to wishlist"
        >
          <svg className="h-4 w-4 transition-colors" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Category */}
        {product.category && (
          <p 
            className="text-xs uppercase tracking-wider mb-2 font-medium"
            style={{ color: 'var(--text-muted)' }}
          >
            {product.category}
          </p>
        )}

        {/* Product Name */}
        <h3 
          className="font-serif text-base mb-3 line-clamp-2 transition-colors min-h-[3rem]"
          style={{ color: 'var(--foreground)' }}
        >
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold" style={{ color: 'var(--primary)' }}>
            NPR {product.price}
          </span>
          {product.discount_price && product.discount_price < product.price && (
            <span 
              className="text-sm line-through"
              style={{ color: 'var(--text-muted)' }}
            >
              NPR {product.discount_price}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart && onAddToCart(product);
          }}
          className="w-full py-2.5 px-4 text-sm font-medium rounded-lg transition-all hover:opacity-90"
          style={{ backgroundColor: 'var(--secondary-foreground)', color: 'var(--card-bg)' }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;