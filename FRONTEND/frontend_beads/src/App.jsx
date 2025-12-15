import {Route, Routes ,Navigate} from "react-router-dom"
import Navbar from "../src/components/ui/Navbar"
import Footer from "../src/components/ui/Footer"
import { Toaster } from "react-hot-toast";
import { isAdmin } from "./utils/auth";

import HomePage from "./pages/main_pages/HomePage";
import CartPage from './pages/main_pages/CartPage';
import CheckoutPage from './pages/main_pages/CheckoutPage';
import OrderDetailPage from './pages/main_pages/OrderDetailPage';
import ShopPage from "./pages/main_pages/ShopPage";
import ProductDetail from "./pages/main_pages/ProductDetail";
import WishlistPage from "./pages/main_pages/WishlistPage";
import AccountPage from "./pages/main_pages/AccountPage";
import ContactUsPage from "./pages/main_pages/ContactUsPage";

import LoginPage from "./pages/sub_pages/LoginPage";
import SignUpPage from "./pages/sub_pages/SignUpPage";

import AdminDashboard from "./pages/admin/pages/AdminDashboard";
import Settings from "./pages/admin/pages/Settings";
import Product from "./pages/admin/pages/Product";
import Customer from "./pages/admin/pages/Customer";
import CustomerProfile from "./pages/admin/components/CustomerProfile";
import Orders from "./pages/admin/pages/Orders";

import Payment from "./pages/admin/pages/Payment";
import Shipping from "./pages/admin/pages/Shipping";
import OrderDetails from "./pages/admin/components/OrderDetails";

import { useLocation } from "react-router-dom";
import ProductForm from "./pages/admin/components/ProductForm";
import { useEffect } from "react";

// Admin route wrapper
function AdminRoute({ children }) {
  return isAdmin() ? children : <Navigate to="/login" replace />;
}

function App() {
  const location = useLocation();
  const hideNavFooter = location.pathname.startsWith("/admin") ||
    ["/login", "/signup"].includes(location.pathname);
  
  // Conditionally load admin.css only for admin routes
  useEffect(() => {
    if (location.pathname.startsWith("/admin")) {
      import("./admin.css");
    }
  }, [location.pathname]);

  return (
    <>
      <Toaster position="top-right" />
      {!hideNavFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><Settings /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><Product /></AdminRoute>} />
        <Route path="/admin/products/add" element={<AdminRoute><ProductForm /></AdminRoute>} />
        <Route path="/admin/products/edit/:id" element={<AdminRoute><ProductForm /></AdminRoute>} />
        <Route path="/admin/customers" element={<AdminRoute><Customer /></AdminRoute>} />
        <Route path="/admin/customers/:id" element={<AdminRoute><CustomerProfile /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><Orders /></AdminRoute>} />
        <Route path="/admin/orders/:id" element={<AdminRoute><OrderDetails /></AdminRoute>} />
        <Route path="/admin/payments" element={<AdminRoute><Payment /></AdminRoute>} />
        <Route path="/admin/shipping" element={<AdminRoute><Shipping /></AdminRoute>} />
      </Routes>
      {!hideNavFooter && <Footer />}
    </>
  );
}

export default App;