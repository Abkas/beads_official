import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserOrders, cancelOrder } from "../../api/orderApi";
import toast from "react-hot-toast";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getUserOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId, e) => {
    e.stopPropagation();
    
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      await cancelOrder(orderId);
      toast.success("Order cancelled successfully");
      // Refresh orders
      fetchOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(error.response?.data?.detail || "Failed to cancel order");
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-serif font-bold mb-8" style={{ color: "var(--foreground)" }}>
          Order History
        </h2>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-r-transparent" style={{ borderColor: "var(--primary)", borderRightColor: "transparent" }}></div>
            <p className="mt-4 text-sm" style={{ color: "var(--muted-foreground)" }}>Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-8" style={{ color: "var(--foreground)" }}>
        Order History
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-12 border rounded-lg" style={{ borderColor: "var(--border)", backgroundColor: "var(--muted)" }}>
          <div className="text-5xl mb-4">📦</div>
          <p className="text-lg font-medium mb-2" style={{ color: "var(--foreground)" }}>
            No orders yet
          </p>
          <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>
            Start shopping to place your first order
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="px-6 py-2 rounded-lg font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusStyle = getStatusColor(order.status);
            const paymentStyle = getPaymentStatusColor(order.payment_status);
            
            return (
              <div
                key={order.id}
                className="p-5 rounded-lg border transition-all hover:shadow-md cursor-pointer"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg" style={{ color: "var(--foreground)" }}>
                        Order #{order.id.slice(-8).toUpperCase()}
                      </h3>
                      <span
                        className="text-xs px-3 py-1 rounded-full font-medium"
                        style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <span
                        className="text-xs px-3 py-1 rounded-full font-medium"
                        style={{ backgroundColor: paymentStyle.bg, color: paymentStyle.text }}
                      >
                        {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                      Placed on {formatDate(order.created_at)}
                    </p>
                    <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
                      {order.item_count} {order.item_count === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold" style={{ color: "var(--primary)" }}>
                      NPR {order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                  <button
                    className="text-sm font-medium transition-opacity hover:opacity-70"
                    style={{ color: "var(--primary)" }}
                  >
                    View Details →
                  </button>
                  {order.status === 'pending' && (
                    <button
                      onClick={(e) => handleCancelOrder(order.id, e)}
                      className="text-sm font-medium transition-opacity hover:opacity-70"
                      style={{ color: "var(--destructive)" }}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
