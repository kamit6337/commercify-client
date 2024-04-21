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

const RootLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    isLoading: isLoadingFindCountry,
    error: errorFindCountry,
    isSuccess: isSuccessFindCountry,
  } = useFindCountryAndExchangeRate();

  const { error, isSuccess, isLoading: isLoadingLoginCheck } = useLoginCheck();

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
    if (
      error ||
      addressError ||
      errorAllProducts ||
      errorAllCategory ||
      errorFindCountry
    ) {
      navigate(
        `/login?msg=${
          error.message ||
          addressError.message ||
          errorAllProducts.message ||
          errorAllCategory.message ||
          errorFindCountry.message
        }`,
        {
          state: { msg: error.message || addressError.message },
        }
      );
    }
  }, [
    error,
    navigate,
    addressError,
    errorAllProducts,
    errorAllCategory,
    errorFindCountry,
  ]);

  if (
    isLoadingLoginCheck ||
    isLoading ||
    isLoadingAllProducts ||
    isLoadingAllCategory ||
    isLoadingFindCountry
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
    !isSuccessFindCountry
  )
    return;

  return (
    <>
      <OfflineDetector />
      <div className="h-20 w-full border-b-2 sticky top-0 z-10 bg-slate-800 text-white">
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
