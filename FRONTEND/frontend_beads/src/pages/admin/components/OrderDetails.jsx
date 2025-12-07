import NavItems from "../ui/NavItems";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const OrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Call GET /api/orders/:id
  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Failed to load order", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  if (loading || !order) {
    return <div className="p-6 text-muted-foreground">Loading order…</div>;
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
        {/* Your existing main content code here */}
      </div>
    </div>
  );
};

export default OrderDetails;
