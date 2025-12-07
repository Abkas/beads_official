import '../../../admin.css';
import { Link, useParams } from "react-router-dom";
import NavItems from "../ui/NavItems";

const OrderDetails = () => {
  // Removed useLocation, handled in NavItems
  const { id } = useParams();

  // TODO: call GET /api/orders/:id
  const order = {
    id: id || "ORD-001",
    date: "January 15, 2024",
    customer: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567"
    },
    shipping: {
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
      method: "Express Shipping",
      status: "Shipped",
      tracking: "1Z999AA10123456784"
    },
    payment: {
      method: "Visa ending in 4242",
      status: "Paid",
      subtotal: "$279.00",
      shipping: "$20.00",
      tax: "$22.32",
      total: "$321.32"
    },
    items: [
      { id: 1, name: "Wireless Bluetooth Headphones", sku: "WBH-001", price: "$99.00", quantity: 2, total: "$198.00", image: "/placeholder.svg" },
      { id: 2, name: "USB-C Hub 7-in-1", sku: "UCH-001", price: "$79.00", quantity: 1, total: "$79.00", image: "/placeholder.svg" },
    ]
  };

  // Removed navItems, now using shared NavItems

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
            <Link to="/admin/orders" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-lg font-semibold text-foreground">Order {order.id}</h1>
            <span className="inline-flex items-center rounded-full bg-info/10 px-2.5 py-0.5 text-xs font-medium text-info">
              {order.shipping.status}
            </span>
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

        {/* Order Details Content */}
        <main className="p-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h2 className="text-lg font-semibold text-foreground">Order Items</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">SKU</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Qty</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                              </div>
                              <span className="text-sm font-medium text-foreground">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{item.sku}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{item.price}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{item.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground text-right">{item.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-6 border-t border-border bg-muted/30">
                  <div className="flex flex-col gap-2 max-w-xs ml-auto">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">{order.payment.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-foreground">{order.payment.shipping}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="text-foreground">{order.payment.tax}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold pt-2 border-t border-border">
                      <span className="text-foreground">Total</span>
                      <span className="text-foreground">{order.payment.total}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Invoice
                </button>
                <button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Email
                </button>
                <button className="inline-flex items-center gap-2 rounded-lg border border-destructive/50 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                  </svg>
                  Refund Order
                </button>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Customer */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <h2 className="text-lg font-semibold text-foreground mb-4">Customer</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">JD</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{order.customer.name}</p>
                      <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                  <Link to="/customers/1" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                    View Profile →
                  </Link>
                </div>
              </div>

              {/* Shipping */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <h2 className="text-lg font-semibold text-foreground mb-4">Shipping</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{order.shipping.method}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {order.shipping.address}<br />
                      {order.shipping.city}, {order.shipping.state} {order.shipping.zip}<br />
                      {order.shipping.country}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">Tracking Number</p>
                    <p className="text-sm font-medium text-primary">{order.shipping.tracking}</p>
                  </div>
                  <select
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    defaultValue={order.shipping.status}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Payment */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <h2 className="text-lg font-semibold text-foreground mb-4">Payment</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
                      {order.payment.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Method</span>
                    <span className="text-sm text-foreground">{order.payment.method}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-sm font-medium text-foreground">Total</span>
                    <span className="text-sm font-bold text-foreground">{order.payment.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrderDetails;
