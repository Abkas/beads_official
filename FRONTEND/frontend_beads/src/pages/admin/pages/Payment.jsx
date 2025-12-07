import NavItems from "../ui/NavItems";

const Payments = () => {

  // TODO: call GET /api/payments
  const transactions = [
    { id: "TXN-001", orderId: "ORD-001", customer: "John Doe", amount: "$299.00", method: "Visa •••• 4242", status: "Paid", date: "Jan 15, 2024" },
    { id: "TXN-002", orderId: "ORD-002", customer: "Jane Smith", amount: "$549.00", method: "Mastercard •••• 5555", status: "Paid", date: "Jan 15, 2024" },
    { id: "TXN-003", orderId: "ORD-003", customer: "Mike Johnson", amount: "$129.00", method: "PayPal", status: "Pending", date: "Jan 14, 2024" },
    { id: "TXN-004", orderId: "ORD-004", customer: "Sarah Wilson", amount: "$899.00", method: "Visa •••• 1234", status: "Paid", date: "Jan 14, 2024" },
    { id: "TXN-005", orderId: "ORD-005", customer: "Chris Brown", amount: "$199.00", method: "Amex •••• 9999", status: "Failed", date: "Jan 13, 2024" },
    { id: "TXN-006", orderId: "ORD-006", customer: "Emily Davis", amount: "$449.00", method: "Visa •••• 4242", status: "Paid", date: "Jan 13, 2024" },
    { id: "TXN-007", orderId: "ORD-007", customer: "David Lee", amount: "$79.00", method: "PayPal", status: "Refunded", date: "Jan 12, 2024" },
    { id: "TXN-008", orderId: "ORD-008", customer: "Lisa Chen", amount: "$329.00", method: "Mastercard •••• 8888", status: "Pending", date: "Jan 12, 2024" },
  ];


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
            <h1 className="text-lg font-semibold text-foreground">Payments</h1>
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
        <main className="p-6 animate-fade-in">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground mt-1">$124,592.00</p>
              <p className="text-xs text-success mt-1">+12.5% from last month</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <p className="text-sm text-muted-foreground">Pending Payments</p>
              <p className="text-2xl font-bold text-foreground mt-1">$4,580.00</p>
              <p className="text-xs text-warning mt-1">8 transactions pending</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <p className="text-sm text-muted-foreground">Failed Payments</p>
              <p className="text-2xl font-bold text-foreground mt-1">$890.00</p>
              <p className="text-xs text-destructive mt-1">3 transactions failed</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <p className="text-sm text-muted-foreground">Refunds</p>
              <p className="text-2xl font-bold text-foreground mt-1">$1,240.00</p>
              <p className="text-xs text-muted-foreground mt-1">5 refunds processed</p>
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
                className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
              <option>All Status</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Failed</option>
              <option>Refunded</option>
            </select>
            <input
              type="date"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Transactions Table */}
          <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Transaction ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{txn.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">{txn.orderId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{txn.customer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{txn.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{txn.method}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          txn.status === "Paid" ? "bg-success/10 text-success" :
                          txn.status === "Pending" ? "bg-warning/10 text-warning" :
                          txn.status === "Failed" ? "bg-destructive/10 text-destructive" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {txn.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{txn.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          {txn.status === "Pending" && (
                            <button className="rounded-lg bg-success px-3 py-1 text-xs font-medium text-success-foreground hover:bg-success/90 transition-colors">
                              Mark Paid
                            </button>
                          )}
                          {txn.status === "Paid" && (
                            <button className="rounded-lg border border-border px-3 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors">
                              Refund
                            </button>
                          )}
                          <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
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
                Showing <span className="font-medium text-foreground">1</span> to <span className="font-medium text-foreground">8</span> of <span className="font-medium text-foreground">1,247</span> transactions
              </p>
              <div className="flex items-center gap-2">
                <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50" disabled>
                  Previous
                </button>
                <button className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">1</button>
                <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">2</button>
                <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">3</button>
                <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Payments;
