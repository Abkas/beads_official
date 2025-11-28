import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Eye } from "lucide-react";

const sampleOrders = [
  {
    id: "ORD-2024-001",
    date: "2024-11-20",
    total: 3500,
    status: "delivered",
    items: ["Traditional Rudraksha Mala", "Colorful Thread Friendship"],
  },
  {
    id: "ORD-2024-002",
    date: "2024-11-15",
    total: 1800,
    status: "shipped",
    items: ["Leather & Stone Combo"],
  },
  {
    id: "ORD-2024-003",
    date: "2024-11-10",
    total: 2200,
    status: "processing",
    items: ["Crystal Healing Bracelet"],
  },
];

const statusColors = {
  delivered: "bg-green-600",
  shipped: "bg-blue-600",
  processing: "bg-yellow-600",
};

const statusLabels = {
  delivered: "Delivered",
  shipped: "Shipped",
  processing: "Processing",
};

export const OrderHistory = () => {
  if (sampleOrders.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
        <p className="text-muted-foreground">
          Your order history will appear here
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Order History</h2>
        <p className="text-muted-foreground">View and track your orders</p>
      </div>

      {sampleOrders.map((order) => (
        <Card key={order.id} className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold">Order {order.id}</h3>
                <Badge className={statusColors[order.status]}>
                  {statusLabels[order.status]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Placed on{" "}
                {new Date(order.date).toLocaleDateString("en-NP")}
              </p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                NPR {order.total}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-2">Items:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              {order.items.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" className="gap-2">
              <Eye className="h-4 w-4" />
              View Details
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
