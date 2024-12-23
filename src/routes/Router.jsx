import { Route, Routes } from "react-router-dom";

// NOTE: LAYOUTS
import AuthLayout from "../layout/AuthLayout";
import RootLayout from "../layout/RootLayout";
import HomeLayout from "../layout/HomeLayout";
import UserLayout from "../layout/UserLayout";
import AdminLayout from "../layout/AdminLayout";
import CartLayout from "../layout/CartLayout";

// NOTE: AUTH LAYOUT PAGES
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import VerifySignUp from "../pages/auth/VerifySignUp";
import VerifyOAuthLogin from "../pages/auth/VerifyOAuthLogin";
import ForgotPassword from "../pages/auth/ForgotPassword";
import NewPassword from "../pages/auth/NewPassword";

// NOTE: ROOT LAYOUT PAGES
import OrderCancel from "../pages/user/OrderCancel";
import OrderReturn from "../pages/user/OrderReturn";
import Wishlist from "../pages/wishlist/Wishlist";
import SingleProduct from "../pages/singleProduct/SingleProduct";
import PaymentSuccess from "../pages/payment/PaymentSuccess";
import PaymentCancel from "../pages/payment/PaymentCancel";
import RateProduct from "../pages/rating/RateProduct";
import UpdateRatedProduct from "../pages/rating/UpdateRatedProduct";

// NOTE: HOME LAYOUT PAGES
import Home from "../pages/home/Home";
import CategoryProducts from "../pages/category/CategoryProducts";
import SearchProducts from "../pages/search/SearchProducts";

// NOTE: CART LAYOUT PAGES
import Cart from "../pages/cart/Cart";
import AddressInCart from "../pages/cart/AddressInCart";
import Checkout from "../pages/cart/Checkout";

// NOTE: USER LAYOUT PAGES
import UserOrders from "../pages/user/UserOrders";
import Profile from "../pages/user/Profile";
import Address from "../pages/user/Address";

// NOTE: ADMIN LAUOUT PAGES
import Admin from "../pages/admin/Admin";
import AddProduct from "../pages/admin/AddProduct";
import UpdateProduct from "../pages/admin/UpdateProduct";

// NOTE: NOT IN ANY LAYOUT
import NotFound from "../pages/notFound/NotFound";

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

      {/* MARK: ROOT LAYOUT */}
      <Route path="/" element={<RootLayout />}>
        {/* NOTE: PRODUCTS ROUTES */}
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Home />} />
          <Route path="category/:id" element={<CategoryProducts />} />
          <Route path="search" element={<SearchProducts />} />
        </Route>

        <Route path="products/:id" element={<SingleProduct />} />
        <Route path="wishlist" element={<Wishlist />} />

        {/* NOTE: PRODUCT RATING */}
        <Route path="ratings/:id" element={<RateProduct />} />
        <Route
          path="ratings/update/:id/:productId"
          element={<UpdateRatedProduct />}
        />

        {/* NOTE: CART ROUTES */}
        <Route path="cart" element={<CartLayout />}>
          <Route index element={<Cart />} />
          <Route path="address" element={<AddressInCart />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>

        {/* NOTE: PAYMENT SUCCESS AND FAILURE */}
        <Route path="payment/success" element={<PaymentSuccess />} />
        <Route path="payment/cancel" element={<PaymentCancel />} />

        {/* NOTE: USER ROUTES */}
        <Route path="user" element={<UserLayout />}>
          <Route index element={<Profile />} />
          <Route path="address" element={<Address />} />
          <Route path="orders" element={<UserOrders />} />
        </Route>

        {/* NOTE: USER CANCEL ORDER */}
        <Route path="orders/cancel/:buyId" element={<OrderCancel />} />
        <Route path="orders/return/:buyId" element={<OrderReturn />} />

        {/* NOTE: PROTECTED ADMIN ROUTES */}
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Admin />} />
          <Route path="add" element={<AddProduct />} />
          <Route path="update" element={<UpdateProduct />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
