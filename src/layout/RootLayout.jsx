import { Outlet, useNavigate } from "react-router-dom";
import ScrollToTop from "../lib/ScrollToTop";
import Navbar from "../containers/Navbar";
import useLoginCheck from "../hooks/auth/useLoginCheck";
import { useEffect } from "react";
import Loading from "../containers/Loading";
import Footer from "../containers/Footer";
import useFindCountryAndExchangeRate from "../hooks/query/useFindCountryAndExchangeRate";
import OfflineDetector from "../lib/OfflineDetector";
import useGetCountryKey from "../hooks/query/useGetCountryKey";

const RootLayout = () => {
  const navigate = useNavigate();

  const { error, isSuccess, isLoading: isLoadingLoginCheck } = useLoginCheck();

  useFindCountryAndExchangeRate();

  useGetCountryKey();

  useEffect(() => {
    if (error) {
      localStorage.removeItem("_cart");
      localStorage.removeItem("_wishlist");
      localStorage.removeItem("_add");
      localStorage.setItem("err", "tru");
      navigate(`/login?msg=${error.message}`);
    }
  }, [error, navigate]);

  if (isLoadingLoginCheck) {
    return <Loading hScreen={true} small={false} />;
  }

  if (!isSuccess) return;

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
