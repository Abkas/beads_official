import NavItems from "../ui/NavItems";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const CustomerProfile = () => {
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Call GET /api/customers/:id
  useEffect(() => {
    const loadCustomer = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/customers/${id}`);
        const data = await res.json();
        setCustomer(data);
      } catch (err) {
        console.error("Failed to load customer", err);
      } finally {
        setLoading(false);
      }
    };

    loadCustomer();
  }, [id]);

  if (loading || !customer) {
    return <div className="p-6 text-muted-foreground">Loading customer…</div>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <span className="text-xl font-bold text-sidebar-foreground">ShopAdmin</span>
        </div>
        <NavItems />
      </aside>
      {/* Main Content */}
      <div className="flex-1 ml-64 p-6">
        {/* ✅ Rest of your existing JSX stays exactly the same */}
      </div>
    </div>
  );
};

export default CustomerProfile;
