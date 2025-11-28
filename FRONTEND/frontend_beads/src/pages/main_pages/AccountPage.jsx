
import { useState } from "react";

const AccountPage = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile Info", icon: "👤" },
    { id: "orders", label: "Order History", icon: "📦" },
    { id: "addresses", label: "Addresses", icon: "📍" },
    { id: "payment", label: "Payment Methods", icon: "💳" },
  ];

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
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <div
                className="p-8 rounded-lg"
                style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}
              >
                <h2
                  className="text-2xl font-serif font-bold mb-8"
                  style={{ color: "var(--foreground)" }}
                >
                  Profile Information
                </h2>
                <div className="space-y-6">
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: "var(--foreground)" }}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Sarah Johnson"
                      className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2"
                      style={{
                        borderColor: "var(--border)",
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: "var(--foreground)" }}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue="sarah@example.com"
                      className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none"
                      style={{
                        borderColor: "var(--border)",
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: "var(--foreground)" }}
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      defaultValue="+1 (555) 123-4567"
                      className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none"
                      style={{
                        borderColor: "var(--border)",
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                      }}
                    />
                  </div>
                  <button
                    className="px-8 py-3 rounded-lg font-semibold transition-all hover:opacity-90 text-white"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div
                className="p-8 rounded-lg"
                style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}
              >
                <h2
                  className="text-2xl font-serif font-bold mb-8"
                  style={{ color: "var(--foreground)" }}
                >
                  Order History
                </h2>
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">📭</div>
                  <p style={{ color: "var(--text-muted)" }} className="mb-6">
                    No orders yet. Start your collection today!
                  </p>
                  <button
                    onClick={() => onNavigate("shop")}
                    className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: "var(--accent)" }}
                  >
                    Explore Collection
                  </button>
                </div>
              </div>
            )}

            {activeTab === "addresses" && (
              <div
                className="p-8 rounded-lg"
                style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}
              >
                <h2
                  className="text-2xl font-serif font-bold mb-8"
                  style={{ color: "var(--foreground)" }}
                >
                  Shipping Addresses
                </h2>
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">📍</div>
                  <p style={{ color: "var(--text-muted)" }} className="mb-6">
                    No addresses saved yet. Add one during checkout or here.
                  </p>
                  <button
                    className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    Add Address
                  </button>
                </div>
              </div>
            )}

            {activeTab === "payment" && (
              <div
                className="p-8 rounded-lg"
                style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}
              >
                <h2
                  className="text-2xl font-serif font-bold mb-8"
                  style={{ color: "var(--foreground)" }}
                >
                  Payment Methods
                </h2>
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">💳</div>
                  <p style={{ color: "var(--text-muted)" }} className="mb-6">
                    No payment methods saved yet. Add one for faster checkout.
                  </p>
                  <button
                    className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: "var(--accent)" }}
                  >
                    Add Payment Method
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
