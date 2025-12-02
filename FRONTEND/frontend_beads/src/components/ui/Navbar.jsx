"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ cart = [], wishlist = [] }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/shop" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-yellow-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-75 transition-opacity"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <span className="text-white font-serif font-bold text-sm">B</span>
            </div>
            <span
              className="hidden sm:inline text-lg font-serif font-bold"
              style={{ color: "var(--primary)" }}
            >
              Beads Official
            </span>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-12">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="text-sm font-medium transition-all duration-200 relative"
                style={{ color: "var(--text-muted)" }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Icons or Login Button */}
          <div className="flex items-center gap-4 md:gap-6">
            {localStorage.getItem("access_token") ? (
              <>
                <button
                  onClick={() => navigate("/wishlist")}
                  className="relative text-lg transition-all hover:scale-110"
                  title="Wishlist"
                >
                  ♡
                  {wishlist.length > 0 && (
                    <span
                      className="absolute -top-2 -right-2 text-xs rounded-full w-5 h-5 flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: "var(--accent)" }}
                    >
                      {wishlist.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => navigate("/cart")}
                  className="relative text-lg transition-all hover:scale-110"
                  title="Shopping Cart"
                >
                  🛒
                  {cart.length > 0 && (
                    <span
                      className="absolute -top-2 -right-2 text-xs rounded-full w-5 h-5 flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: "var(--accent)" }}
                    >
                      {cart.length}
                    </span>
                  )}
                </button>

                {/* Account */}
                <button
                  onClick={() => navigate("/account")}
                  className="hidden md:flex items-center justify-center w-8 h-8 rounded-full text-white font-serif font-bold transition-all hover:scale-110"
                  style={{ backgroundColor: "var(--primary)" }}
                  title="Account"
                >
                  👤
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors font-medium"
              >
                Login
              </button>
            )}

            {/* Mobile Toggle */}
            <button
              className="md:hidden text-xl transition-transform"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden mt-4 space-y-2 border-t pt-4"
            style={{ borderColor: "var(--border)" }}
          >
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-3 rounded transition-all"
                style={{ color: "var(--text-muted)" }}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                navigate("/account");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-3 rounded transition-all"
              style={{ color: "var(--text-muted)" }}
            >
              Account
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
