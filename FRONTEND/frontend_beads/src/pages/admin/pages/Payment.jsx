import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavItems from "../ui/NavItems";
import { getAllPayments, updatePaymentStatus, getPaymentStats } from "../../../api/admin/paymentApi";
import toast from "react-hot-toast";

const Payments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingPayment, setUpdatingPayment] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const [ordersData, statsData] = await Promise.all([
        getAllPayments(),
        getPaymentStats()
      ]);
      console.log("Payment data received:", ordersData);
      console.log("Stats data received:", statsData);
      setOrders(ordersData);
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingPayment(orderId);
      await updatePaymentStatus(orderId, newStatus);
      toast.success(`Payment status updated to ${newStatus}`);
      await fetchPayments();
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Failed to update payment status");
    } finally {
      setUpdatingPayment(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      paid: "bg-success/10 text-success",
      unpaid: "bg-warning/10 text-warning",
      failed: "bg-destructive/10 text-destructive",
      refunded: "bg-muted text-muted-foreground"
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = searchQuery === "" || 
      order._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.order_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user_id?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || 
      order.payment_status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Default stats while loading
  const displayStats = stats || {
    total_revenue: 0,
    total_orders: 0,
    unpaid_amount: 0,
    unpaid_count: 0,
    paid_amount: 0,
    paid_count: 0,
    failed_amount: 0,
    failed_count: 0,
    refunded_amount: 0,
    refunded_count: 0
  };


  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-50 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <svg className="h-5 w-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-sidebar-foreground">ShopAdmin</span>
        </div>
        <NavItems />
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors lg:hidden"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-base sm:text-lg font-semibold text-foreground">Payments</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">AD</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@store.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* Payments Content */}
        <main className="p-4 sm:p-6 animate-fade-in">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground mt-1">NPR {displayStats.total_revenue.toLocaleString()}</p>
              <p className="text-xs text-success mt-1">{displayStats.total_orders} total orders</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <p className="text-sm text-muted-foreground">Paid Payments</p>
              <p className="text-2xl font-bold text-success mt-1">NPR {displayStats.paid_amount.toLocaleString()}</p>
              <p className="text-xs text-success mt-1">{displayStats.paid_count} transactions completed</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <p className="text-sm text-muted-foreground">Pending Payments</p>
              <p className="text-2xl font-bold text-warning mt-1">NPR {displayStats.unpaid_amount.toLocaleString()}</p>
              <p className="text-xs text-warning mt-1">{displayStats.unpaid_count} transactions pending</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <p className="text-sm text-muted-foreground">Failed & Refunded</p>
              <p className="text-2xl font-bold text-destructive mt-1">NPR {(displayStats.failed_amount + displayStats.refunded_amount).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">{displayStats.failed_count} failed · {displayStats.refunded_count} refunded</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Transactions Table */}
          <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                <p className="ml-3 text-muted-foreground">Loading payments...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <svg className="h-16 w-16 text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-foreground font-medium mb-1">No payments found</p>
                <p className="text-sm text-muted-foreground">
                  {searchQuery || statusFilter !== "all" 
                    ? "Try adjusting your filters" 
                    : "Payments will appear here once orders are placed"}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Method</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredOrders.map((order) => (
                        <tr key={order._id || order.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link to={`/admin/orders/${order._id || order.id}`} className="text-sm font-medium text-primary hover:text-primary/80">
                              #{(order._id || order.id)?.slice(-8).toUpperCase()}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-foreground">
                                {order.shipping_address?.full_name || 'N/A'}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ID: {order.user_id?.slice(0, 8)}...
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                            NPR {order.total?.toLocaleString() || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {order.payment_method ? order.payment_method.charAt(0).toUpperCase() + order.payment_method.slice(1) : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                              {order.payment_status?.charAt(0).toUpperCase() + order.payment_status?.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {formatDate(order.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <select
                                value={order.payment_status}
                                onChange={(e) => handlePaymentStatusChange(order._id || order.id, e.target.value)}
                                disabled={updatingPayment === (order._id || order.id)}
                                className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                              >
                                <option value="unpaid">Unpaid</option>
                                <option value="paid">Paid</option>
                                <option value="failed">Failed</option>
                                <option value="refunded">Refunded</option>
                              </select>
                              <Link 
                                to={`/admin/orders/${order._id || order.id}`}
                                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-border px-6 py-4">
                  <p className="text-sm text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{filteredOrders.length}</span> of <span className="font-medium text-foreground">{orders.length}</span> transactions
                  </p>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Payments;
