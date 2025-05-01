import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import useLoginCheck from "@/hooks/auth/useLoginCheck";
import Loading from "@/lib/Loading";
import OfflineDetector from "@/lib/OfflineDetector";
import ScrollToTop from "@/lib/ScrollToTop";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const RootLayout = () => {
  const navigate = useNavigate();
  const { isLoading, error, isSuccess } = useLoginCheck();

  useEffect(() => {
    if (error) {
      navigate(`/login?msg=${error.message}`);
    }
  }, [error]);

  if (isLoading) {
    return <Loading />;
  }

  if (!isSuccess) return;

  return (
    <>
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
    </>
  );
};

export default RootLayout;
