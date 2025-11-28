import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { AddressManager } from "@/components/profile/AddressManager";
import { PaymentOptions } from "@/components/profile/PaymentOptions";
import { OrderHistory } from "@/components/profile/OrderHistory";
import { User, MapPin, CreditCard, Package } from "lucide-react";

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Account</h1>
        <p className="text-muted-foreground">Manage your profile and orders</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>

          <TabsTrigger value="address" className="gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Address</span>
          </TabsTrigger>

          <TabsTrigger value="payment" className="gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Payment</span>
          </TabsTrigger>

          <TabsTrigger value="orders" className="gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Orders</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="animate-fade-in">
          <Card className="p-6">
            <ProfileInfo />
          </Card>
        </TabsContent>

        <TabsContent value="address" className="animate-fade-in">
          <AddressManager />
        </TabsContent>

        <TabsContent value="payment" className="animate-fade-in">
          <Card className="p-6">
            <PaymentOptions />
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="animate-fade-in">
          <OrderHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountPage;
