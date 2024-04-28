import { Outlet, useNavigate } from "react-router-dom";
import ScrollToTop from "../lib/ScrollToTop";
import Navbar from "../containers/Navbar";
import useLoginCheck from "../hooks/auth/useLoginCheck";
import { useEffect } from "react";
import useUserAddress from "../hooks/query/useUserAddress";
import { useDispatch } from "react-redux";
import { initialAddressData } from "../redux/slice/addressSlice";
import Loading from "../containers/Loading";
import Footer from "../containers/Footer";
import useAllProducts from "../hooks/query/useAllProducts";
import useAllCategory from "../hooks/query/useAllCategory";
import useFindCountryAndExchangeRate from "../hooks/query/useFindCountryAndExchangeRate";
import OfflineDetector from "../lib/OfflineDetector";
import useGetCountryKey from "../hooks/query/useGetCountryKey";
import useUserOrders from "../hooks/query/useUserOrders";

const RootLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { error, isSuccess, isLoading: isLoadingLoginCheck } = useLoginCheck();

  useFindCountryAndExchangeRate();

  useGetCountryKey();

  const {
    isLoading: isLoadingAllProducts,
    error: errorAllProducts,
    isSuccess: isSuccessAllProducts,
  } = useAllProducts(isSuccess);

  const {
    isLoading: isLoadingAllCategory,
    error: errorAllCategory,
    isSuccess: isSuccessAllCategory,
  } = useAllCategory(isSuccess);

  const {
    data: addressData,
    error: addressError,
    isLoading,
    isSuccess: isSuccessUserAddress,
  } = useUserAddress(isSuccess);

  const {
    isLoading: isLoadingUserOrders,
    error: errorUserOrders,
    isSuccess: isSuccessUserOrders,
  } = useUserOrders(isSuccess);

  useEffect(() => {
    if (addressData) {
      dispatch(initialAddressData(addressData));
    }
  }, [addressData, dispatch]);

  useEffect(() => {
    if (error) {
      localStorage.removeItem("_cart");
      localStorage.removeItem("_wishlist");
    }
  }, [error]);

  useEffect(() => {
    if (error) {
      navigate(`/login?msg=${error.message}`);
      return;
    }

    if (addressError) {
      navigate(`/login?msg=${addressError.message}`);
      return;
    }
    if (errorAllProducts) {
      navigate(`/login?msg=${errorAllProducts.message}`);
      return;
    }
    if (errorAllCategory) {
      navigate(`/login?msg=${errorAllCategory.message}`);
      return;
    }
    if (errorUserOrders) {
      navigate(`/login?msg=${errorUserOrders.message}`);
      return;
    }
  }, [
    error,
    navigate,
    addressError,
    errorAllProducts,
    errorAllCategory,
    errorUserOrders,
  ]);

  if (
    isLoadingLoginCheck ||
    isLoading ||
    isLoadingAllProducts ||
    isLoadingAllCategory ||
    isLoadingUserOrders
  ) {
    return (
      <div className="h-screen w-full">
        <Loading />
      </div>
    );
  }

  if (
    !isSuccess ||
    !isSuccessAllProducts ||
    !isSuccessAllCategory ||
    !isSuccessUserAddress ||
    !isSuccessUserOrders
  )
    return;

  return (
    <>
      <OfflineDetector />
      <div className="h-20 w-full border-b-2 sticky top-0 z-20 bg-slate-800 text-white">
        <Navbar />
      </div>
      <Outlet />
      <div className="h-96 w-full bg-slate-800 text-white">
        <Footer />
      </div>
      <ScrollToTop />
    </>
  );
};

export default RootLayout;
