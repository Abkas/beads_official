import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserCart, clearCart } from "../../api/cartApi";
import { getUserAddresses } from "../../api/addressApi";
import { createOrder } from "../../api/orderApi";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState(false);

  useEffect(() => {
    fetchCheckoutData();
  }, []);

  const fetchCheckoutData = async () => {
    try {
      setLoading(true);
      const [cartData, addressData] = await Promise.all([
        getUserCart(),
        getUserAddresses()
      ]);
      
      setCart(cartData);
      setAddresses(addressData);
      
      // Auto-select default address
      const defaultAddr = addressData.find(addr => addr.is_default);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr.id);
      } else if (addressData.length > 0) {
        setSelectedAddress(addressData[0].id);
      }
    } catch (error) {
      console.error("Error fetching checkout data:", error);
      toast.error("Failed to load checkout data");
      navigate("/cart");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    if (!cart || cart.total_items === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setProcessingOrder(true);
    try {
      // Find the index of the selected address
      const addressIndex = addresses.findIndex(addr => addr.id === selectedAddress);
      
      const orderData = {
        address_index: addressIndex,
        payment_method: paymentMethod,
        coupon_code: null // TODO: Add coupon support
      };
      
      const order = await createOrder(orderData);
      
      // Clear cart after successful order
      await clearCart();
      
      toast.success("Order placed successfully!");
      setTimeout(() => {
        navigate("/account?tab=orders");
      }, 1500);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(error.response?.data?.detail || "Failed to place order. Please try again.");
    } finally {
      setProcessingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--background)" }}>
        <div className="text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-r-transparent" style={{ borderColor: "var(--primary)", borderRightColor: "transparent" }}></div>
          <p className="mt-4 text-base" style={{ color: "var(--muted-foreground)" }}>Loading checkout...</p>
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
            Add items to your cart before checking out
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="px-8 py-3 rounded-lg font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const shippingCost = 100; // Fixed shipping cost
  const totalAmount = cart.total_price + shippingCost;

  return (
    <div className="min-h-screen py-8 sm:py-12" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-2" style={{ color: "var(--foreground)" }}>
            Checkout
          </h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Complete your order
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address Section */}
            <div className="p-6 rounded-xl border" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-serif font-bold" style={{ color: "var(--foreground)" }}>
                  Delivery Address
                </h2>
                <button
                  onClick={() => navigate("/profile/addresses")}
                  className="text-sm font-medium transition-opacity hover:opacity-70"
                  style={{ color: "var(--primary)" }}
                >
                  + Add New Address
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="mb-4" style={{ color: "var(--muted-foreground)" }}>
                    No delivery addresses found
                  </p>
                  <button
                    onClick={() => navigate("/profile/addresses")}
                    className="px-6 py-2 rounded-lg font-medium transition-all hover:opacity-90"
                    style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
                  >
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      onClick={() => setSelectedAddress(address.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedAddress === address.id ? 'shadow-md' : 'hover:border-opacity-60'
                      }`}
                      style={{
                        borderColor: selectedAddress === address.id ? "var(--primary)" : "var(--border)",
                        backgroundColor: selectedAddress === address.id ? "var(--primary-foreground)" : "transparent"
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold" style={{ color: "var(--foreground)" }}>
                              {address.full_name}
                            </span>
                            <span 
                              className="text-xs px-2 py-1 rounded"
                              style={{
                                backgroundColor: address.address_type === 'Home' ? '#dcfce7' : 
                                               address.address_type === 'Work' ? '#dbeafe' : '#f3e8ff',
                                color: address.address_type === 'Home' ? '#166534' : 
                                       address.address_type === 'Work' ? '#1e40af' : '#6b21a8'
                              }}
                            >
                              {address.address_type}
                            </span>
                            {address.is_default && (
                              <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: "var(--muted)", color: "var(--foreground)" }}>
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm mb-1" style={{ color: "var(--muted-foreground)" }}>
                            {address.phone_number}
                          </p>
                          <p className="text-sm" style={{ color: "var(--foreground)" }}>
                            {address.tole}, {address.city}, {address.district}
                          </p>
                          {address.landmark && (
                            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                              Landmark: {address.landmark}
                            </p>
                          )}
                        </div>
                        <div className="ml-4">
                          <div 
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedAddress === address.id ? 'border-primary' : ''
                            }`}
                            style={{ 
                              borderColor: selectedAddress === address.id ? "var(--primary)" : "var(--border)"
                            }}
                          >
                            {selectedAddress === address.id && (
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--primary)" }}></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Method Section */}
            <div className="p-6 rounded-xl border" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
              <h2 className="text-xl font-serif font-bold mb-4" style={{ color: "var(--foreground)" }}>
                Payment Method
              </h2>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === "cod" ? 'shadow-md' : 'hover:border-opacity-60'
                  }`}
                  style={{
                    borderColor: paymentMethod === "cod" ? "var(--primary)" : "var(--border)",
                    backgroundColor: paymentMethod === "cod" ? "var(--primary-foreground)" : "transparent"
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--muted)" }}>
                        <svg className="w-6 h-6" style={{ color: "var(--foreground)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color: "var(--foreground)" }}>Cash on Delivery</p>
                        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Pay when you receive</p>
                      </div>
                    </div>
                    <div 
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center`}
                      style={{ 
                        borderColor: paymentMethod === "cod" ? "var(--primary)" : "var(--border)"
                      }}
                    >
                      {paymentMethod === "cod" && (
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--primary)" }}></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Online Payment */}
                <div
                  onClick={() => setPaymentMethod("online")}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === "online" ? 'shadow-md' : 'hover:border-opacity-60'
                  }`}
                  style={{
                    borderColor: paymentMethod === "online" ? "var(--primary)" : "var(--border)",
                    backgroundColor: paymentMethod === "online" ? "var(--primary-foreground)" : "transparent"
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--muted)" }}>
                        <svg className="w-6 h-6" style={{ color: "var(--foreground)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color: "var(--foreground)" }}>Online Payment</p>
                        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Credit/Debit Card, eSewa, Khalti</p>
                      </div>
                    </div>
                    <div 
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center`}
                      style={{ 
                        borderColor: paymentMethod === "online" ? "var(--primary)" : "var(--border)"
                      }}
                    >
                      {paymentMethod === "online" && (
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--primary)" }}></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="p-6 rounded-xl border" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
              <h2 className="text-xl font-serif font-bold mb-6" style={{ color: "var(--foreground)" }}>
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-6 pb-6 border-b" style={{ borderColor: "var(--border)" }}>
                {cart.items.map((item) => (
                  <div key={item.product_id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: "var(--muted)" }}>
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
                        <svg className="h-8 w-8" style={{ color: "var(--muted-foreground)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate" style={{ color: "var(--foreground)" }}>
                        {item.product_name}
                      </p>
                      <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                      NPR {item.subtotal.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="flex justify-between text-base" style={{ color: "var(--foreground)" }}>
                  <span>Subtotal ({cart.total_items} items)</span>
                  <span className="font-semibold">NPR {cart.total_price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base" style={{ color: "var(--foreground)" }}>
                  <span>Shipping</span>
                  <span className="font-semibold">NPR {shippingCost.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between text-xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
                <span>Total</span>
                <span style={{ color: "var(--primary)" }}>NPR {totalAmount.toFixed(2)}</span>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={processingOrder || !selectedAddress}
                className="w-full px-4 py-3.5 rounded-lg font-semibold transition-all hover:opacity-90 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
              >
                {processingOrder ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-r-transparent border-white"></div>
                    Processing...
                  </span>
                ) : (
                  "Place Order"
                )}
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="w-full mt-3 px-4 py-3 border rounded-lg font-medium transition-all hover:bg-opacity-5"
                style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
