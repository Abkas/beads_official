import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Banknote, CreditCard } from "lucide-react";

export const PaymentOptions = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Payment Options</h2>
        <p className="text-muted-foreground">
          Choose your preferred payment method
        </p>
      </div>

      <div className="space-y-4">
        {/* Cash on Delivery */}
        <Card className="p-6 border-2 border-primary">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Banknote className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">Cash on Delivery</h3>
                <Badge variant="default">Recommended</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Pay when you receive your order. No advance payment required.
                Available across all Nepal.
              </p>
              <p className="text-sm font-medium text-primary">
                ✓ Most popular payment method in Nepal
              </p>
            </div>
          </div>
        </Card>

        {/* eSewa */}
        <Card className="p-6 opacity-60">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-muted">
              <CreditCard className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">eSewa</h3>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Digital wallet payment option will be available soon for faster
                checkout.
              </p>
            </div>
          </div>
        </Card>

        {/* Khalti */}
        <Card className="p-6 opacity-60">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-muted">
              <CreditCard className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">Khalti</h3>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Digital wallet payment option will be available soon for faster
                checkout.
              </p>
            </div>
          </div>
        </Card>

        {/* Card Payment */}
        <Card className="p-6 opacity-60">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-muted">
              <CreditCard className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">Credit/Debit Card</h3>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Online card payment option will be available soon for
                international orders.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
