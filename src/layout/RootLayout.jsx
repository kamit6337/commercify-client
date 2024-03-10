import { Outlet, useNavigate } from "react-router-dom";
import ScrollToTop from "../lib/ScrollToTop";
import Navbar from "../containers/Navbar";
import useLoginCheck from "../hooks/auth/useLoginCheck";
import { useEffect } from "react";

const RootLayout = () => {
  const navigate = useNavigate();
  const { data, error } = useLoginCheck();

  useEffect(() => {
    if (error) {
      navigate(`/login?msg=${error.message}`, {
        state: { msg: error.message },
      });
    }
  }, [error, navigate]);

  if (!data) return;

  return (
    <>
      <div className="h-20 w-full border-b-2 sticky top-0 z-10 bg-white">
        <Navbar />
      </div>
      <Outlet />
      <ScrollToTop />
    </>
  );
};

export default RootLayout;
