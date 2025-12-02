import {Route, Routes ,Navigate} from "react-router-dom"
import Navbar from "../src/components/ui/Navbar"
import Footer from "../src/components/ui/Footer"

import HomePage from "./pages/main_pages/HomePage";
import CartPage from './pages/main_pages/CartPage';
import ShopPage from "./pages/main_pages/ShopPage";
import WishlistPage from "./pages/main_pages/WishlistPage";
import AccountPage from "./pages/main_pages/AccountPage";
import ContactUsPage from "./pages/main_pages/ContactUsPage";

import LoginPage from "./pages/sub_pages/LoginPage";
import SignUpPage from "./pages/sub_pages/SignUpPage";


import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const hideNavFooter = ["/login", "/signup"].includes(location.pathname);
  return (
    <>
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
      </Routes>
      {!hideNavFooter && <Footer />}
    </>
  );
}

export default App;