import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import useLoginCheck from "@/hooks/auth/useLoginCheck";
import useAllCountry from "@/hooks/countryAndCurrency/useAllCountry";
import useCountryInfoFromIP from "@/hooks/countryAndCurrency/useCountryInfoFromIP";
import usePingServer from "@/hooks/general/usePingServer";
import InitialLoading from "@/lib/InitialLoading";
import Loading from "@/lib/Loading";
import OfflineDetector from "@/lib/OfflineDetector";
import ScrollToTop from "@/lib/ScrollToTop";
import SocketProviders from "@/providers/SocketProviders";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const RootLayout = () => {
  const navigate = useNavigate();

  usePingServer();

  const { isLoading, error, isSuccess } = useLoginCheck();

  const {
    isLoading: isLoadingAllCountry,
    error: errorAllCountry,
    isSuccess: isSuccessAllCountry,
    isFindCountry,
  } = useAllCountry(isSuccess);

  const { isLoading: isLoadingCountryFromLatLan } = useCountryInfoFromIP(
    isSuccessAllCountry && !isFindCountry
  );

  const [showInitialLoading, setShowInitialLoading] = useState(() => {
    const value = sessionStorage.getItem("initialLoading");
    if (!value) return true;
    return value === "1" ? false : true;
  });

  useEffect(() => {
    if (error) {
      sessionStorage.setItem("initialLoading", "1");
      setShowInitialLoading(false);
      navigate(`/login?msg=${error.message}`);
    }
    if (errorAllCountry) {
      sessionStorage.setItem("initialLoading", "1");
      setShowInitialLoading(false);
      navigate(`/login?msg=${errorAllCountry.message}`);
    }
  }, [error, errorAllCountry]);

  useEffect(() => {
    if (isSuccess) {
      sessionStorage.setItem("initialLoading", "1");
      setShowInitialLoading(false);
    }
  }, [isSuccess]);

  const handleInitialLoadingTimeout = () => {
    setShowInitialLoading(false); // This will simulate the loading timeout
  };

  if (showInitialLoading) {
    return <InitialLoading onTimeout={handleInitialLoadingTimeout} />;
  }

  if (isLoading || isLoadingAllCountry || isLoadingCountryFromLatLan) {
    return <Loading />;
  }

  if (!isSuccess || !isSuccessAllCountry) {
    return <div>Error: Unable to login. Please try after sometime</div>; // Display error when isSuccess is false
  }

  return (
    <SocketProviders>
      <OfflineDetector />
      <div className="h-20 w-full border-b-2 sticky top-0 z-20 bg-background px-5 md:px-12">
        <Navbar />
      </div>
      <Outlet />
      <div className="h-96 w-full">
        <Footer />
      </div>
      <ScrollToTop />
      <ToastContainer />
    </SocketProviders>
  );
};

export default RootLayout;
