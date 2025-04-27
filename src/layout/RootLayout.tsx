import Footer from "@/containers/Footer";
import Navbar from "@/containers/Navbar";
import OfflineDetector from "@/lib/OfflineDetector";
import ScrollToTop from "@/lib/ScrollToTop";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const RootLayout = () => {
  return (
    <>
      <OfflineDetector />
      <div className="h-20 w-full border-b-2 sticky top-0 z-20">
        <Navbar />
      </div>
      {/* <Outlet /> */}
      <div className="h-96 w-full">
        <Footer />
      </div>
      <ScrollToTop />
      <ToastContainer />
    </>
  );
};

export default RootLayout;
