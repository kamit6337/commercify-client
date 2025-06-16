import { Routes, Route } from "react-router-dom";
import RootLayout from "@/layout/RootLayout";
import Login from "@/pages/auth/Login";
import SignUp from "@/pages/auth/SignUp";
import VerifySignUp from "@/pages/auth/VerifySignUp";
import Home from "@/pages/home/Home";
import AuthLayout from "@/layout/AuthLayout";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import NewPassword from "@/pages/auth/NewPassword";
import VerifyOAuthLogin from "@/pages/auth/VerifyOAuthLogin";
import HomeLayout from "@/layout/HomeLayout";
import CategoryProducts from "@/pages/category/CategoryProducts";
import SearchProducts from "@/pages/search/SearchProducts";
import SingleProduct from "@/pages/product/SingleProduct";
import Wishlist from "@/pages/wishlist/Wishlist";
import CartLayout from "@/layout/CartLayout";
import Cart from "@/pages/cart/Cart";
import AddressInCart from "@/pages/cart/AddressInCart";
import Checkout from "@/pages/cart/Checkout";
import RateProduct from "@/pages/ratings/RateProduct";
import PaymentSuccess from "@/pages/payment/PaymentSuccess";
import PaymentCancel from "@/pages/payment/PaymentCancel";
import UserLayout from "@/layout/UserLayout";
import Profile from "@/pages/user/Profile";
import Address from "@/pages/user/Address";
import UserOrders from "@/pages/user/UserOrders";
import OrderCancel from "@/pages/orders/OrderCancel";
import OrderReturn from "@/pages/orders/OrderReturn";
import AdminLayout from "@/layout/AdminLayout";
import Admin from "@/pages/admin/Admin";
import NotFound from "@/pages/notFound/NotFound";
import OrderStatusLayout from "@/layout/OrderStatusLayout";
import Ordered from "@/pages/admin/orderStatus/Ordered";
import Delivered from "@/pages/admin/orderStatus/Delivered";
import Cancelled from "@/pages/admin/orderStatus/Cancelled";
import Returned from "@/pages/admin/orderStatus/Returned";
import AdminProductsLayout from "@/layout/AdminProductsLayout";
import AdminProducts from "@/pages/admin/products/AdminProducts";
import AdminCategoryProducts from "@/pages/admin/products/AdminCategoryProducts";
import UnDelivered from "@/pages/admin/orderStatus/UnDelivered";

const Router = () => {
  return (
    <Routes>
      {/* NOTE: AUTH ROUTES */}
      <Route path="/" element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup/verify" element={<VerifySignUp />} />
        <Route path="/oauth" element={<VerifyOAuthLogin />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/newPassword" element={<NewPassword />} />
      </Route>

      {/* NOTE: ROOTLAYOUT */}
      <Route path="/" element={<RootLayout />}>
        {/* NOTE: PRODUCTS ROUTES */}
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Home />} />
          <Route path="category/:id" element={<CategoryProducts />} />
          <Route path="search" element={<SearchProducts />} />
        </Route>

        <Route path="products/:id" element={<SingleProduct />} />
        <Route path="wishlist" element={<Wishlist />} />

        {/* NOTE: CART ROUTES */}
        <Route path="cart" element={<CartLayout />}>
          <Route index element={<Cart />} />
          <Route path="address" element={<AddressInCart />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>

        {/* NOTE: PAYMENT SUCCESS AND FAILURE */}
        <Route path="payment/success" element={<PaymentSuccess />} />
        <Route path="payment/cancel" element={<PaymentCancel />} />

        {/* NOTE: PRODUCT RATING */}
        <Route path="ratings/create" element={<RateProduct />} />

        {/* NOTE: USER ROUTES */}
        <Route path="user" element={<UserLayout />}>
          <Route index element={<Profile />} />
          <Route path="address" element={<Address />} />
          <Route path="orders" element={<UserOrders />} />
        </Route>

        {/* NOTE: USER CANCEL ORDER */}
        <Route path="orders/cancel/:buyId" element={<OrderCancel />} />
        <Route path="orders/return/:buyId" element={<OrderReturn />} />
      </Route>
      {/* NOTE: PROTECTED ADMIN ROUTES */}
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Admin />} />

        <Route path="order-status" element={<OrderStatusLayout />}>
          <Route index element={<Ordered />} />
          <Route path="un-delivered" element={<UnDelivered />} />
          <Route path="delivered" element={<Delivered />} />
          <Route path="cancelled" element={<Cancelled />} />
          <Route path="returned" element={<Returned />} />
        </Route>

        <Route path="products" element={<AdminProductsLayout />}>
          <Route index element={<AdminProducts />} />
          <Route path="category/:id" element={<AdminCategoryProducts />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
