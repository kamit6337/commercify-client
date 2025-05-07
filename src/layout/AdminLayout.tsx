import Footer from "@/components/footer/Footer";
import useAdminCountDetails from "@/hooks/admin/useAdminCountDetails";
import useProductsCount from "@/hooks/admin/useProductsCount";
import useLoginAdminCheck from "@/hooks/auth/useLoginAdminCheck";
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
  } = useLoginAdminCheck();

  useEffect(() => {
    if (errorLoginCheck) {
      showErrorMessage({ message: errorLoginCheck.message });
      navigate("/");
    }
  }, [errorLoginCheck]);

  const { isLoading, error } = useAdminCountDetails(isSuccess);
  const { isLoading: isLoadingProductsCount, error: errorProductsCount } =
    useProductsCount(isSuccess);

  if (isLoading || isLoadingProductsCount || isLoadingLoginCheck) {
    return <Loading />;
  }

  if (error || errorProductsCount) {
    return <p>{error?.message || errorProductsCount?.message}</p>;
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
