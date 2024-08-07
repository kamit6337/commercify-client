import { useEffect } from "react";
import useLoginCheck from "../hooks/auth/useLoginCheck";
import { Outlet, useNavigate } from "react-router-dom";
import Loading from "../containers/Loading";

const AuthLayout = () => {
  const navigate = useNavigate();
  const { isSuccess, isLoading } = useLoginCheck();

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [isSuccess, navigate]);

  if (isLoading) {
    return (
      <>
        <Loading hScreen={true} small={false} />
      </>
    );
  }

  if (isSuccess) return;

  return (
    <>
      <Outlet />
    </>
  );
};

export default AuthLayout;
