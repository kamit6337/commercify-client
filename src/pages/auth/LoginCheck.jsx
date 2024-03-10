import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Loading from "../../containers/Loading";
import UseOAuthLogin from "../../hooks/auth/UseOAuthLogin";

const LoginCheck = () => {
  const navigate = useNavigate();
  const { isLoading, isError, error, isSuccess } = UseOAuthLogin();

  useEffect(() => {
    if (isSuccess) {
      navigate("/", { state: { message: "Successfully Logged In." } });
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isError) {
      navigate("/login", { state: { message: error.message } });
    }
  }, [isError, error, navigate]);

  if (isLoading) {
    return <Loading />;
  }

  return;
};

export default LoginCheck;
