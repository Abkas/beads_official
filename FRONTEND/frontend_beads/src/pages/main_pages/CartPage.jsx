import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserCart, updateCartItem, removeFromCart, clearCart } from "../../api/cartApi";
import toast from "react-hot-toast";

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await getUserCart();
      setCart(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (product_id, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      const data = await updateCartItem(product_id, newQuantity);
      setCart(data);
      toast.success("Cart updated");
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart");
    }
  };

  const handleRemove = async (product_id) => {
    try {
      await removeFromCart(product_id);
      await fetchCart();
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;
    
    try {
      await clearCart();
      await fetchCart();
      toast.success("Cart cleared");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--background)" }}>
        <div className="text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-r-transparent" style={{ borderColor: "var(--primary)", borderRightColor: "transparent" }}></div>
          <p className="mt-4 text-base" style={{ color: "var(--muted-foreground)" }}>Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.total_items === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--background)" }}>
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-6 text-7xl">🛒</div>
          <h2 className="text-3xl font-serif font-bold mb-3" style={{ color: "var(--foreground)" }}>
            Your cart is empty
          </h2>
          <p className="text-base mb-8" style={{ color: "var(--muted-foreground)" }}>
            Discover our beautiful collection of handmade beads and accessories
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="px-8 py-3 rounded-lg font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 sm:py-12" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold" style={{ color: "var(--foreground)" }}>
              Shopping Cart
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
              {cart.total_items} {cart.total_items === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            onClick={handleClearCart}
            className="text-sm font-medium hover:opacity-70 transition-opacity"
            style={{ color: "var(--destructive)" }}
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div 
                  key={item.product_id} 
                  className="flex gap-4 p-4 sm:p-5 rounded-xl border transition-all hover:shadow-md"
                  style={{ 
                    borderColor: "var(--border)", 
                    backgroundColor: "var(--card)" 
                  }}
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: "var(--muted)" }}>
                    {item.product_image ? (
                      <img 
                        src={item.product_image} 
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full flex items-center justify-center" style={{ display: item.product_image ? 'none' : 'flex' }}>
                      <svg className="h-10 w-10" style={{ color: "var(--muted-foreground)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg mb-1 truncate" style={{ color: "var(--foreground)" }}>
                      {item.product_name}
                    </h3>
                    <p className="text-base font-medium mb-3" style={{ color: "var(--primary)" }}>
                      NPR {item.price.toFixed(2)}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 rounded-md border flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-opacity-10"
                        style={{ 
                          borderColor: "var(--border)", 
                          color: "var(--foreground)",
                          backgroundColor: "transparent"
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="w-10 text-center font-semibold text-base" style={{ color: "var(--foreground)" }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                        className="w-8 h-8 rounded-md border flex items-center justify-center transition-all hover:bg-opacity-10"
                        style={{ 
                          borderColor: "var(--border)", 
                          color: "var(--foreground)",
                          backgroundColor: "transparent"
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleRemove(item.product_id)}
                        className="ml-2 p-2 rounded-md transition-all hover:bg-opacity-10"
                        style={{ color: "var(--destructive)" }}
                        title="Remove item"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Subtotal */}
                  <div className="hidden sm:flex flex-col items-end justify-between">
                    <p className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
                      NPR {item.subtotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary - Sticky on desktop */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="p-6 rounded-xl border" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
              <h2 className="text-xl font-serif font-bold mb-6" style={{ color: "var(--foreground)" }}>
                Order Summary
              </h2>
              
              <div className="space-y-3 mb-6 pb-6 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="flex justify-between text-base" style={{ color: "var(--foreground)" }}>
                  <span>Subtotal ({cart.total_items} {cart.total_items === 1 ? 'item' : 'items'})</span>
                  <span className="font-semibold">NPR {cart.total_price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm" style={{ color: "var(--muted-foreground)" }}>
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              
              <div className="flex justify-between text-xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
                <span>Total</span>
                <span style={{ color: "var(--primary)" }}>NPR {cart.total_price.toFixed(2)}</span>
              </div>
              
              <button 
                onClick={() => navigate("/checkout")}
                className="w-full px-4 py-3.5 rounded-lg font-semibold transition-all hover:opacity-90 shadow-sm"
                style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
              >
                Proceed to Checkout
              </button>
              
              <button 
                onClick={() => navigate("/shop")}
                className="w-full mt-3 px-4 py-3 border rounded-lg font-medium transition-all hover:bg-opacity-5"
                style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
