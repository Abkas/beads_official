import { Link, useParams } from "react-router-dom";
import NavItems from "../ui/NavItems";
import { useState, useEffect } from "react";
import { getCustomerById } from "../../../api/admin/customerApi";

const CustomerProfile = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchCustomer();
    }
  }, [id]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCustomerById(id);
      setCustomer(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching customer:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getCustomerName = (customer) => {
    if (!customer) return "";
    if (customer.firstname || customer.lastname) {
      return `${customer.firstname || ''} ${customer.lastname || ''}`.trim();
    }
    return customer.username || "";
  };

  const getCustomerInitials = (customer) => {
    if (!customer) return "??";
    if (customer.firstname && customer.lastname) {
      return `${customer.firstname[0]}${customer.lastname[0]}`.toUpperCase();
    }
    if (customer.username && customer.username.length >= 2) {
      return customer.username.substring(0, 2).toUpperCase();
    }
    if (customer.email && customer.email.length >= 2) {
      return customer.email.substring(0, 2).toUpperCase();
    }
    return "??";
  };

  const getCustomerStatus = (customer) => {
    if (!customer) return "Unknown";
    if (customer.is_admin) return "VIP";
    if (customer.is_active) return "Active";
    return "Inactive";
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
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
      <div className="flex-1 ml-64">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <div className="flex items-center gap-4">
            <Link to="/admin/customers" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-lg font-semibold text-foreground">Customer Profile</h1>
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

        {/* Profile Content */}
        <main className="p-6 animate-fade-in">
          {loading && (
            <div className="rounded-xl border border-border bg-card shadow-card p-12 text-center">
              <p className="text-muted-foreground">Loading customer profile...</p>
            </div>
          )}

          {error && !loading && (
            <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 text-center">
              <p className="text-destructive font-medium">Error: {error}</p>
              <button 
                onClick={fetchCustomer}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && customer && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xl font-bold text-primary">
                        {getCustomerInitials(customer)}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        {getCustomerName(customer)}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          getCustomerStatus(customer) === "Active" ? "bg-success/10 text-success" :
                          getCustomerStatus(customer) === "VIP" ? "bg-primary/10 text-primary" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {getCustomerStatus(customer)}
                        </span>
                        {customer.is_verified && (
                          <span className="inline-flex items-center gap-1 text-xs text-primary">
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-foreground">{customer.email || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-foreground">{customer.phone || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-muted-foreground">Customer since {formatDate(customer.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-foreground">Addresses</h3>
                    {customer.addresses && customer.addresses.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {customer.addresses.length} {customer.addresses.length === 1 ? 'address' : 'addresses'}
                      </span>
                    )}
                  </div>
                  {customer.addresses && customer.addresses.length > 0 ? (
                    <div className="space-y-4">
                      {customer.addresses.map((addr, idx) => (
                        <div 
                          key={idx} 
                          className="p-4 rounded-lg border transition-all"
                          style={{
                            borderColor: addr.is_default ? "var(--primary)" : "var(--border)",
                            backgroundColor: addr.is_default ? "var(--primary-light)" : "transparent"
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span 
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold text-white"
                                style={{
                                  backgroundColor: addr.address_type === 'Home' ? '#10b981' : addr.address_type === 'Work' ? '#3b82f6' : '#8b5cf6'
                                }}
                              >
                                {addr.address_type === 'Home' && '🏠'}
                                {addr.address_type === 'Work' && '💼'}
                                {addr.address_type === 'Other' && '📍'}
                                {addr.address_type}
                              </span>
                              {addr.is_default && (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  Default
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="font-semibold text-foreground text-sm">{addr.full_name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                              </svg>
                              {addr.phone_number}
                            </div>
                            <div className="flex items-start gap-2 text-xs text-muted-foreground mt-2">
                              <svg className="w-3 h-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              <span>
                                {addr.tole && `${addr.tole}, `}
                                {addr.city}, {addr.district}<br />
                                {addr.province}, {addr.country}
                                {addr.landmark && (
                                  <span className="block mt-1 text-muted-foreground/80">
                                    📍 {addr.landmark}
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <svg className="h-12 w-12 mx-auto text-muted-foreground mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-sm text-muted-foreground">No address on file</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button className="w-full rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Send Email
                  </button>
                  <button className="w-full rounded-lg border border-destructive/50 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
                    Deactivate Account
                  </button>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      {customer.total_orders || 0}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                    <p className="text-sm text-muted-foreground">Cart Items</p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      {customer.cart_items || 0}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                    <p className="text-sm text-muted-foreground">Wishlist Items</p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      {customer.wishlist_items || 0}
                    </p>
                  </div>
                </div>

                {/* Order History */}
                <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
                  <div className="p-6 border-b border-border">
                    <h3 className="text-lg font-semibold text-foreground">Recent Orders</h3>
                  </div>
                  {customer.orders && customer.orders.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border bg-muted/50">
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Items</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Payment</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {customer.orders.map((order) => {
                            const getStatusColor = (status) => {
                              const colors = {
                                pending: 'bg-yellow-100 text-yellow-800',
                                processing: 'bg-blue-100 text-blue-800',
                                shipped: 'bg-purple-100 text-purple-800',
                                delivered: 'bg-green-100 text-green-800',
                                cancelled: 'bg-red-100 text-red-800'
                              };
                              return colors[status] || 'bg-gray-100 text-gray-800';
                            };

                            const getPaymentColor = (status) => {
                              const colors = {
                                paid: 'bg-green-100 text-green-800',
                                unpaid: 'bg-yellow-100 text-yellow-800',
                                failed: 'bg-red-100 text-red-800',
                                refunded: 'bg-blue-100 text-blue-800'
                              };
                              return colors[status] || 'bg-gray-100 text-gray-800';
                            };

                            return (
                              <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                                  #{order.id.slice(-8).toUpperCase()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                  {formatDate(order.created_at)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                  {order.item_count} {order.item_count === 1 ? 'item' : 'items'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-foreground">
                                  NPR {order.total.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentColor(order.payment_status)}`}>
                                    {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <svg className="h-16 w-16 mx-auto text-muted-foreground mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <p className="text-muted-foreground">No orders yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CustomerProfile;
  