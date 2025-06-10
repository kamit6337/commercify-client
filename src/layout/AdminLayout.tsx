import Footer from "@/components/footer/Footer";
import useProductsCount from "@/hooks/admin/useProductsCount";
import useLoginCheck from "@/hooks/auth/useLoginCheck";
import useAllCountry from "@/hooks/countryAndCurrency/useAllCountry";
import useCountryInfoFromIP from "@/hooks/countryAndCurrency/useCountryInfoFromIP";
import Loading from "@/lib/Loading";
import ScrollToTop from "@/lib/ScrollToTop";
import Toastify from "@/lib/Toastify";
import AdminNavbar from "@/pages/admin/navbar/AdminNavbar";
import SocketProviders from "@/providers/SocketProviders";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const AdminLayout = () => {
  const { showErrorMessage } = Toastify();
  const navigate = useNavigate();

  const {
    isLoading: isLoadingLoginCheck,
    error: errorLoginCheck,
    isSuccess,
  } = useLoginCheck();

  const {
    isLoading: isLoadingAllCountry,
    error: errorAllCountry,
    isSuccess: isSuccessAllCountry,
    isFindCountry,
  } = useAllCountry(isSuccess);

  const { isLoading: isLoadingCountryInfoFromIP } = useCountryInfoFromIP(
    isSuccessAllCountry && !isFindCountry
  );

  const { isLoading: isLoadingProductsCount, error: errorProductsCount } =
    useProductsCount(isSuccess);

  useEffect(() => {
    if (errorLoginCheck) {
      showErrorMessage({ message: errorLoginCheck.message });
      navigate("/");
    }
  }, [errorLoginCheck]);

  if (
    isLoadingProductsCount ||
    isLoadingLoginCheck ||
    isLoadingAllCountry ||
    isLoadingCountryInfoFromIP
  ) {
    return <Loading />;
  }

  if (errorProductsCount || errorAllCountry) {
    return <p>{errorProductsCount?.message || errorAllCountry?.message}</p>;
  }

  if (!isSuccess) return;

  return (
    <SocketProviders>
      <div className="h-20 w-full border-b-2 sticky top-0 z-20 bg-background px-5 md:px-12">
        <AdminNavbar />
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

export default AdminLayout;
