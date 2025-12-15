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
                  <h3 className="text-sm font-semibold text-foreground mb-4">Shipping Address</h3>
                  {customer.addresses && customer.addresses.length > 0 ? (
                    <div className="space-y-4">
                      {customer.addresses.map((addr, idx) => (
                        <div key={idx} className="text-sm text-muted-foreground">
                          <p className="font-medium text-foreground">{addr.label || `Address ${idx + 1}`}</p>
                          <p>{addr.street || ""}</p>
                          <p>{addr.city || ""}{addr.state ? `, ${addr.state}` : ""} {addr.zip || ""}</p>
                          <p>{addr.country || ""}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No address on file</p>
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
                      {customer.order_history?.length || 0}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                    <p className="text-sm text-muted-foreground">Cart Items</p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      {customer.Cart?.length || 0}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                    <p className="text-sm text-muted-foreground">Wishlist Items</p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      {customer.wishlist?.length || 0}
                    </p>
                  </div>
                </div>

                {/* Order History */}
                <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
                  <div className="p-6 border-b border-border">
                    <h3 className="text-lg font-semibold text-foreground">Order History</h3>
                  </div>
                  {customer.order_history && customer.order_history.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border bg-muted/50">
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {customer.order_history.map((orderId, idx) => (
                            <tr key={idx} className="hover:bg-muted/30 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                                {orderId}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground"></td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground"></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <p className="text-muted-foreground">No order history</p>
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
  