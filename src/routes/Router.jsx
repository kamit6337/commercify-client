import { Route, Routes } from "react-router-dom";
import RootLayout from "../layout/RootLayout";
import UserLayout from "../layout/UserLayout";
import AdminLayout from "../layout/AdminLayout";
import SignUp from "../pages/auth/SignUp";
import Login from "../pages/auth/Login";
import LoginCheck from "../pages/auth/LoginCheck";
import Home from "../pages/home/Home";
import CategoryProducts from "../pages/category/CategoryProducts";
import SearchProducts from "../pages/search/SearchProducts";
import SingleProduct from "../pages/singleProduct/SingleProduct";
import User from "../pages/user/User";
import UserUpdate from "../pages/user/UserUpdate";
import UserOrders from "../pages/user/UserOrders";
import Admin from "../pages/admin/Admin";
import AddProduct from "../pages/admin/AddProduct";
import UpdateProduct from "../pages/admin/UpdateProduct";
import ErrorPage from "../pages/error/ErrorPage";
import HomeLayout from "../layout/HomeLayout";
import Wishlist from "../pages/wishlist/Wishlist";
import Cart from "../pages/cart/Cart";
import CartLayout from "../layout/CartLayout";

const Router = () => {
  return (
    <Routes>
      {/* NOTE: AUTH ROUTES */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/login/check" element={<LoginCheck />} />

      {/* NOTE: ERROR ROUTE */}
      <Route path="/error" element={<ErrorPage />} />

      {/* MARK: ROOT LAYOUT */}
      <Route path="/" element={<RootLayout />}>
        {/* NOTE: PRODUCTS ROUTES */}
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Home />} />
          <Route path="category/:id" element={<CategoryProducts />} />
          <Route path="search" element={<SearchProducts />} />

          <Route path="products/:id" element={<SingleProduct />} />
          <Route path="wishlist" element={<Wishlist />} />
        </Route>

        {/* NOTE: CART ROUTES */}
        <Route path="cart" element={<CartLayout />}>
          <Route index element={<Cart />} />
          {/* <Route path="address" element={<CartAddress />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="payment" element={<Payment />} />
          <Route path="success" element={<OrderSuccess />} /> */}
        </Route>

        {/* NOTE: USER ROUTES */}
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<User />} />
          <Route path="update" element={<UserUpdate />} />
          <Route path="orders" element={<UserOrders />} />
        </Route>

        {/* NOTE: PROTECTED ADMIN ROUTES */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Admin />} />
          <Route path="add" element={<AddProduct />} />
          <Route path="update" element={<UpdateProduct />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Router;
