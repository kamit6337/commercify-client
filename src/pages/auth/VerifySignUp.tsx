import { postAuthReq } from "@/utils/api/authApi";
import { useNavigate } from "react-router-dom";
import Helmet from "react-helmet";
import Cookies from "js-cookie";
import VerifyOTP from "@/components/auth/VerifyOTP";
import useLoginCheck from "@/hooks/auth/useLoginCheck";

const VerifySignUp = () => {
  const { refetch } = useLoginCheck(false);

  const navigate = useNavigate();

  const handleVerify = async (email: string, otp: string) => {
    const token = await postAuthReq("/signup/verify", { email, otp });
    Cookies.set("_use", token, { expires: 30 });
    Cookies.remove("email");
    refetch();
    navigate("/");
  };

  return (
    <>
      <Helmet>
        <title>Verify</title>
        <meta
          name="discription"
          content="Signup Verify page of Voosh project"
        />
      </Helmet>
      <VerifyOTP callback={handleVerify} />
    </>
  );
};

export default VerifySignUp;
