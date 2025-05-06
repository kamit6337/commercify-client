import Footer from "@/components/footer/Footer";
import useAdminCountDetails from "@/hooks/admin/useAdminCountDetails";
import useProductsCount from "@/hooks/admin/useProductsCount";
import Loading from "@/lib/Loading";
import ScrollToTop from "@/lib/ScrollToTop";
import AdminNavbar from "@/pages/admin/navbar/AdminNavbar";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const AdminLayout = () => {
  const { isLoading, error } = useAdminCountDetails();
  const { isLoading: isLoadingProductsCount, error: errorProductsCount } =
    useProductsCount();

  if (isLoading || isLoadingProductsCount) {
    return <Loading />;
  }

  if (error || errorProductsCount) {
    return <p>{error?.message || errorProductsCount?.message}</p>;
  }

  return (
    <>
      <div className="h-20 w-full border-b-2 sticky top-0 z-20 bg-background px-5 md:px-12">
        <AdminNavbar />
      </div>
      <Outlet />
      <div className="h-96 w-full">
        <Footer />
      </div>
      <ScrollToTop />
      <ToastContainer />
    </>
  );
};

export default AdminLayout;
