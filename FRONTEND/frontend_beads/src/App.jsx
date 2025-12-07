import {Route, Routes ,Navigate} from "react-router-dom"
import Navbar from "../src/components/ui/Navbar"
import Footer from "../src/components/ui/Footer"
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/main_pages/HomePage";
import CartPage from './pages/main_pages/CartPage';
import ShopPage from "./pages/main_pages/ShopPage";
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
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/products" element={<Product />} />
        <Route path="/admin/products/add" element={<ProductForm />} />
        <Route path="/admin/products/edit/:id" element={<ProductForm />} />
        <Route path="/admin/customers" element={<Customer />} />
        <Route path="/admin/customers/:id" element={<CustomerProfile />} />
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/orders/:id" element={<OrderDetails />} />
        <Route path="/admin/payments" element={<Payment />} />
        <Route path="/admin/shipping" element={<Shipping />} />
      </Routes>
      {!hideNavFooter && <Footer />}
    </>
  );
}

export default App;