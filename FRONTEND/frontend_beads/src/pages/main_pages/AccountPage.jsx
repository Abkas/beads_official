import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileInfo from "../../components/profile/ProfileInfo";
import OrderHistory from "../../components/profile/OrderHistory";
import AddressManager from "../../components/profile/AddressManager";
import PaymentOptions from "../../components/profile/PaymentOptions";
import { logout } from "../../api/UserApi";
import { toast } from "react-hot-toast";

const AccountPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  // Redirect to login if not logged in
  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      navigate("/");
    }
  }, [navigate]);

  const tabs = [
    { id: "profile", label: "Profile Info", icon: "👤" },
    { id: "orders", label: "Order History", icon: "📦" },
    { id: "addresses", label: "Addresses", icon: "📍" },
    { id: "payment", label: "Payment Methods", icon: "💳" },
  ];

  const handleLogout = () => {
    try {
      logout();
      toast.success("Logged out successfully!");
      setTimeout(() => navigate("/"), 0);
    } catch (err) {
      toast.error(err.message || "Logout failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{ backgroundColor: "var(--primary-light)" }}
            >
              👤
            </div>
            <div>
              <h1 className="text-4xl font-serif font-bold" style={{ color: "var(--foreground)" }}>
                My Account
              </h1>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                Manage your profile, orders, and preferences
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-auto px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors font-medium"
              style={{ marginLeft: "auto" }}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Tabs */}
          <div className="lg:col-span-1">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="w-full text-left px-4 py-4 rounded-lg transition-all duration-200 font-medium flex items-center gap-3 group"
                  style={{
                    backgroundColor: activeTab === tab.id ? "var(--accent)" : "transparent",
                    color: activeTab === tab.id ? "white" : "var(--text-muted)",
                    borderLeft:
                      activeTab === tab.id ? `3px solid var(--primary)` : "3px solid transparent",
                  }}
                >
                  <span className="text-lg">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 p-8 rounded-lg" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
            {activeTab === "profile" && <ProfileInfo />}
            {activeTab === "orders" && <OrderHistory />}
            {activeTab === "addresses" && <AddressManager />}
            {activeTab === "payment" && <PaymentOptions />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
