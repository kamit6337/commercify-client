import { Outlet, useNavigate } from "react-router-dom";
import ScrollToTop from "../lib/ScrollToTop";
import Navbar from "../containers/Navbar";
import useLoginCheck from "../hooks/auth/useLoginCheck";
import { useEffect } from "react";
import useUserAddress from "../hooks/query/useUserAddress";
import { useDispatch } from "react-redux";
import { initialAddressData } from "../redux/slice/addressSlice";
import Loading from "../containers/Loading";

const RootLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    data,
    error,
    isSuccess,
    isLoading: isLoadingLoginCheck,
  } = useLoginCheck();

  const {
    data: addressData,
    error: addressError,
    isLoading,
  } = useUserAddress(isSuccess);

  useEffect(() => {
    if (addressData) {
      dispatch(initialAddressData(addressData));
    }
  }, [addressData, dispatch]);

  useEffect(() => {
    if (error || addressError) {
      navigate(`/login?msg=${error.message || addressError.message}`, {
        state: { msg: error.message || addressError.message },
      });
    }
  }, [error, navigate, addressError]);

  if (!data) return;

  if (isLoadingLoginCheck || isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

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
