import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, cancelOrder } from "../../api/orderApi";
import toast from "react-hot-toast";

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [trackingExpanded, setTrackingExpanded] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const data = await getOrderById(id);
      setOrder(data);
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Failed to load order details");
      navigate("/account?tab=orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    setCancelling(true);
    try {
      await cancelOrder(id);
      toast.success("Order cancelled successfully");
      fetchOrderDetails(); // Refresh order details
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(error.response?.data?.detail || "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: '#fef3c7', text: '#92400e' },
      processing: { bg: '#dbeafe', text: '#1e40af' },
      shipped: { bg: '#e0e7ff', text: '#4338ca' },
      delivered: { bg: '#dcfce7', text: '#166534' },
      cancelled: { bg: '#fee2e2', text: '#991b1b' }
    };
    return colors[status] || { bg: '#f3f4f6', text: '#374151' };
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      paid: { bg: '#dcfce7', text: '#166534' },
      unpaid: { bg: '#fef3c7', text: '#92400e' },
      failed: { bg: '#fee2e2', text: '#991b1b' },
      refunded: { bg: '#e0e7ff', text: '#4338ca' }
    };
    return colors[status] || { bg: '#f3f4f6', text: '#374151' };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--background)" }}>
        <div className="text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-r-transparent" style={{ borderColor: "var(--primary)", borderRightColor: "transparent" }}></div>
          <p className="mt-4 text-base" style={{ color: "var(--muted-foreground)" }}>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--background)" }}>
        <div className="text-center">
          <p className="text-xl mb-4" style={{ color: "var(--foreground)" }}>Order not found</p>
          <button
            onClick={() => navigate("/account?tab=orders")}
            className="px-6 py-2 rounded-lg font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const statusStyle = getStatusColor(order.status);
  const paymentStyle = getPaymentStatusColor(order.payment_status);

  return (
    <div className="min-h-screen py-8 sm:py-12" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section - Enhanced */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/account?tab=orders")}
            className="flex items-center gap-2 text-sm mb-6 transition-all hover:gap-3 group"
            style={{ color: "var(--muted-foreground)" }}
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Orders
          </button>
          
          <div className="rounded-2xl border p-6 sm:p-8" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--primary)", opacity: 0.1 }}>
                  <svg className="w-8 h-8" style={{ color: "var(--primary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-1" style={{ color: "var(--foreground)" }}>
                    Order #{order.id.slice(-8).toUpperCase()}
                  </h1>
                  <div className="flex items-center gap-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Placed on {formatDate(order.created_at)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="px-4 py-2 rounded-lg font-medium text-sm shadow-sm"
                  style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <span
                  className="px-4 py-2 rounded-lg font-medium text-sm shadow-sm"
                  style={{ backgroundColor: paymentStyle.bg, color: paymentStyle.text }}
                >
                  {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                </span>
              </div>
            </div>

            {/* Order Summary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t" style={{ borderColor: "var(--border)" }}>
              <div className="text-center sm:text-left">
                <p className="text-xs font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>Total Items</p>
                <p className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>Total Amount</p>
                <p className="text-xl font-bold" style={{ color: "var(--primary)" }}>
                  NPR {order.total.toFixed(2)}
                </p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>Payment Method</p>
                <p className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
                  {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>Order Status</p>
                <p className="text-xl font-bold capitalize" style={{ color: statusStyle.text }}>
                  {order.status}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items - Enhanced */}
            <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
              <div className="p-6 border-b" style={{ borderColor: "var(--border)", backgroundColor: "var(--muted)", backgroundOpacity: 0.3 }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--primary)", opacity: 0.1 }}>
                    <svg className="w-5 h-5" style={{ color: "var(--primary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-serif font-bold" style={{ color: "var(--foreground)" }}>
                    Order Items ({order.items.length})
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={item.product_id} className="flex gap-4 pb-4 border-b last:border-b-0" style={{ borderColor: "var(--border)" }}>
                      <div className="relative">
                        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-sm" style={{ backgroundColor: "var(--muted)" }}>
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
                            <svg className="h-12 w-12" style={{ color: "var(--muted-foreground)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-2 text-base" style={{ color: "var(--foreground)" }}>
                          {item.product_name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md" style={{ backgroundColor: "var(--muted)" }}>
                            <svg className="w-4 h-4" style={{ color: "var(--muted-foreground)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <span style={{ color: "var(--muted-foreground)" }}>NPR {item.price.toFixed(2)} each</span>
                          </div>
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md" style={{ backgroundColor: "var(--muted)" }}>
                            <svg className="w-4 h-4" style={{ color: "var(--muted-foreground)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span style={{ color: "var(--muted-foreground)" }}>Qty: {item.quantity}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex flex-col justify-between">
                        <p className="text-xs font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>Subtotal</p>
                        <p className="text-xl font-bold" style={{ color: "var(--primary)" }}>
                          NPR {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Shipping Address - Enhanced */}
            <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
              <div className="p-6 border-b" style={{ borderColor: "var(--border)", backgroundColor: "var(--muted)", backgroundOpacity: 0.3 }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--primary)", opacity: 0.1 }}>
                    <svg className="w-5 h-5" style={{ color: "var(--primary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-serif font-bold" style={{ color: "var(--foreground)" }}>
                    Delivery Address
                  </h2>
                </div>
              </div>
              <div className="p-6">
                {order.shipping_address && Object.keys(order.shipping_address).length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: "var(--muted)" }}>
                      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "var(--primary)" }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-semibold text-base mb-1" style={{ color: "var(--foreground)" }}>
                          {order.shipping_address.full_name}
                        </p>
                        <div className="flex items-center gap-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          {order.shipping_address.phone_number}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: "var(--muted)" }}>
                      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "var(--primary)" }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <div className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                        {order.shipping_address.tole && <span>{order.shipping_address.tole}, </span>}
                        {order.shipping_address.city}, {order.shipping_address.district}<br />
                        {order.shipping_address.province}, {order.shipping_address.country}
                        {order.shipping_address.landmark && (
                          <p className="mt-2 flex items-start gap-2" style={{ color: "var(--muted-foreground)" }}>
                            <svg className="w-4 h-4 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <span>Landmark: {order.shipping_address.landmark}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: "var(--muted-foreground)" }}>No address information</p>
                )}
              </div>
            </div>

            {/* Order Tracking Timeline */}
            <div className="rounded-xl border p-6" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
              <button
                onClick={() => setTrackingExpanded(!trackingExpanded)}
                className="w-full flex items-center justify-between mb-6 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <h2 className="text-xl font-serif font-bold" style={{ color: "var(--foreground)" }}>
                  Order Tracking
                </h2>
                <svg
                  className={`w-5 h-5 transition-transform ${trackingExpanded ? 'rotate-180' : ''}`}
                  style={{ color: "var(--foreground)" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {!trackingExpanded ? (
                // Collapsed view - show only current status
                <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: "var(--muted)" }}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    order.status === 'delivered' ? 'bg-success' : 
                    order.status === 'cancelled' ? 'bg-destructive' : 'bg-primary'
                  }`}>
                    {order.status === 'cancelled' ? (
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : order.status === 'delivered' ? (
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    ) : order.status === 'shipped' ? (
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                    ) : order.status === 'processing' ? (
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                      {order.status === 'cancelled' ? 'Order Cancelled' :
                       order.status === 'delivered' ? 'Delivered' :
                       order.status === 'shipped' ? 'Shipped' :
                       order.status === 'processing' ? 'Processing' :
                       'Order Placed'}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
                      {order.status === 'delivered' ? 'Your order has been delivered successfully' :
                       order.status === 'cancelled' ? 'This order has been cancelled' :
                       order.status === 'shipped' ? 'Your order is out for delivery' :
                       order.status === 'processing' ? 'We are preparing your order' :
                       'Your order has been received'}
                    </p>
                  </div>
                  <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                    Click to expand
                  </p>
                </div>
              ) : (
                // Expanded view - show full timeline
                <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5" style={{ backgroundColor: "var(--border)" }}></div>
                
                {/* Timeline Steps */}
                <div className="space-y-6">
                  {/* Order Placed */}
                  <div className="relative flex gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                      ['pending', 'processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-primary' : 'bg-muted'
                    }`}>
                      <svg className={`w-6 h-6 ${
                        ['pending', 'processing', 'shipped', 'delivered'].includes(order.status) ? 'text-white' : 'text-muted-foreground'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className={`font-semibold ${
                        ['pending', 'processing', 'shipped', 'delivered'].includes(order.status) ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        Order Placed
                      </h3>
                      <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                        {formatDate(order.created_at)}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                        Your order has been received
                      </p>
                    </div>
                  </div>

                  {/* Processing */}
                  <div className="relative flex gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                      ['processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-primary' : 
                      order.status === 'cancelled' ? 'bg-muted' : 'border-2'
                    }`} style={{ borderColor: order.status === 'pending' ? 'var(--border)' : undefined }}>
                      <svg className={`w-6 h-6 ${
                        ['processing', 'shipped', 'delivered'].includes(order.status) ? 'text-white' : 'text-muted-foreground'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className={`font-semibold ${
                        ['processing', 'shipped', 'delivered'].includes(order.status) ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        Processing
                      </h3>
                      <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                        {['processing', 'shipped', 'delivered'].includes(order.status) ? 'In progress' : 'Pending'}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                        We are preparing your order
                      </p>
                    </div>
                  </div>

                  {/* Shipped */}
                  <div className="relative flex gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                      ['shipped', 'delivered'].includes(order.status) ? 'bg-primary' : 
                      order.status === 'cancelled' ? 'bg-muted' : 'border-2'
                    }`} style={{ borderColor: ['pending', 'processing'].includes(order.status) ? 'var(--border)' : undefined }}>
                      <svg className={`w-6 h-6 ${
                        ['shipped', 'delivered'].includes(order.status) ? 'text-white' : 'text-muted-foreground'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className={`font-semibold ${
                        ['shipped', 'delivered'].includes(order.status) ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        Shipped
                      </h3>
                      <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                        {['shipped', 'delivered'].includes(order.status) ? 'Out for delivery' : 'Not yet shipped'}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                        Your order is on the way
                      </p>
                    </div>
                  </div>

                  {/* Delivered */}
                  <div className="relative flex gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                      order.status === 'delivered' ? 'bg-success' : 
                      order.status === 'cancelled' ? 'bg-destructive' : 'border-2'
                    }`} style={{ borderColor: ['pending', 'processing', 'shipped'].includes(order.status) ? 'var(--border)' : undefined }}>
                      {order.status === 'cancelled' ? (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      ) : (
                        <svg className={`w-6 h-6 ${
                          order.status === 'delivered' ? 'text-white' : 'text-muted-foreground'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className={`font-semibold ${
                        order.status === 'delivered' ? 'text-success' : 
                        order.status === 'cancelled' ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {order.status === 'cancelled' ? 'Order Cancelled' : 'Delivered'}
                      </h3>
                      <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                        {order.status === 'delivered' ? 'Order completed' : 
                         order.status === 'cancelled' ? 'Order was cancelled' : 'Awaiting delivery'}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                        {order.status === 'delivered' ? 'Your order has been delivered successfully' :
                         order.status === 'cancelled' ? 'This order has been cancelled' :
                         'You will receive your order soon'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary - Enhanced */}
            <div className="rounded-xl border overflow-hidden sticky top-6" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
              <div className="p-6 border-b" style={{ borderColor: "var(--border)", backgroundColor: "var(--muted)", backgroundOpacity: 0.3 }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--primary)", opacity: 0.1 }}>
                    <svg className="w-5 h-5" style={{ color: "var(--primary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-serif font-bold" style={{ color: "var(--foreground)" }}>
                    Order Summary
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3 mb-4 pb-4 border-b" style={{ borderColor: "var(--border)" }}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>Subtotal</span>
                    <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>NPR {order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>Shipping</span>
                    <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>NPR {order.shipping_cost.toFixed(2)}</span>
                  </div>
                  {order.discount_amount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>Discount</span>
                      <span className="text-sm font-semibold" style={{ color: "var(--success)" }}>- NPR {order.discount_amount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center p-4 rounded-lg" style={{ backgroundColor: "var(--primary)", backgroundOpacity: 0.1 }}>
                  <span className="text-base font-bold" style={{ color: "var(--foreground)" }}>Total</span>
                  <span className="text-2xl font-bold" style={{ color: "var(--primary)" }}>NPR {order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method - Enhanced */}
            <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
              <div className="p-6 border-b" style={{ borderColor: "var(--border)", backgroundColor: "var(--muted)", backgroundOpacity: 0.3 }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--primary)", opacity: 0.1 }}>
                    <svg className="w-5 h-5" style={{ color: "var(--primary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                    Payment Method
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "var(--muted)" }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--primary)", opacity: 0.2 }}>
                    {order.payment_method === 'cod' ? (
                      <svg className="w-5 h-5" style={{ color: "var(--primary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" style={{ color: "var(--primary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                      {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                      {order.payment_method === 'cod' ? 'Pay when you receive' : 'Paid online'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {order.status === 'pending' && (
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="w-full px-4 py-3 rounded-lg font-semibold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  style={{ backgroundColor: "var(--destructive)", color: "white" }}
                >
                  {cancelling ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Cancelling...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel Order
                    </span>
                  )}
                </button>
              )}

              <button
                onClick={() => navigate("/account?tab=orders")}
                className="w-full px-4 py-3 border rounded-lg font-medium transition-all hover:bg-opacity-10 flex items-center justify-center gap-2 group"
                style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
