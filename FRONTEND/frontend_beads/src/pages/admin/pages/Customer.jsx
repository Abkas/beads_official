import '../../../admin.css';
import NavItems from "../ui/NavItems";
import { Link } from "react-router-dom";

const Customers = () => {

  // TODO: call GET /api/customers
  const customers = [
    { id: 1, name: "John Doe", email: "john@example.com", phone: "+1 (555) 123-4567", joinDate: "Jan 15, 2024", orders: 12, spent: "$2,450.00", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "+1 (555) 234-5678", joinDate: "Jan 10, 2024", orders: 8, spent: "$1,890.00", status: "Active" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", phone: "+1 (555) 345-6789", joinDate: "Dec 28, 2023", orders: 3, spent: "$450.00", status: "Active" },
    { id: 4, name: "Sarah Wilson", email: "sarah@example.com", phone: "+1 (555) 456-7890", joinDate: "Dec 15, 2023", orders: 15, spent: "$4,230.00", status: "VIP" },
    { id: 5, name: "Chris Brown", email: "chris@example.com", phone: "+1 (555) 567-8901", joinDate: "Nov 20, 2023", orders: 0, spent: "$0.00", status: "Inactive" },
    { id: 6, name: "Emily Davis", email: "emily@example.com", phone: "+1 (555) 678-9012", joinDate: "Nov 10, 2023", orders: 22, spent: "$6,780.00", status: "VIP" },
    { id: 7, name: "David Lee", email: "david@example.com", phone: "+1 (555) 789-0123", joinDate: "Oct 25, 2023", orders: 5, spent: "$890.00", status: "Active" },
    { id: 8, name: "Lisa Chen", email: "lisa@example.com", phone: "+1 (555) 890-1234", joinDate: "Oct 15, 2023", orders: 9, spent: "$1,560.00", status: "Active" },
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
            <h1 className="text-lg font-semibold text-foreground">Customers</h1>
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

        {/* Customers Content */}
        <main className="p-6 animate-fade-in">
          {/* Search */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search customers..."
                className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
              <option>All Status</option>
              <option>Active</option>
              <option>VIP</option>
              <option>Inactive</option>
            </select>
            <button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>

          {/* Customers Table */}
          <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-3 text-left">
                      <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Join Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Orders</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Spent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {customer.name.split(" ").map(n => n[0]).join("")}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{customer.name}</p>
                            <p className="text-xs text-muted-foreground">{customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{customer.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{customer.joinDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{customer.orders}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{customer.spent}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          customer.status === "Active" ? "bg-success/10 text-success" :
                          customer.status === "VIP" ? "bg-primary/10 text-primary" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link to={`/admin/customers/${customer.id}`} className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                          View Profile
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-border px-6 py-4">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">1</span> to <span className="font-medium text-foreground">8</span> of <span className="font-medium text-foreground">892</span> customers
              </p>
              <div className="flex items-center gap-2">
                <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50" disabled>
                  Previous
                </button>
                <button className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">1</button>
                <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">2</button>
                <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">3</button>
                <span className="text-muted-foreground">...</span>
                <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">112</button>
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

export default Customers;
