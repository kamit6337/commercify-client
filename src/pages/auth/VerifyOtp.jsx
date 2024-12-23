import Cookies from "js-cookie";
import { useState } from "react";
import OtpInput from "./OtpInput";
import { useNavigate } from "react-router-dom";
import Toastify from "../../lib/Toastify";
import Loading from "../../containers/Loading";

const modifyEmail = (email) => {
  const splitEmail = email.split("@");
  const emailProvider = splitEmail.at(-1);
  const slice = splitEmail.slice(0, -1);
  const joined = slice.join("@");
  const firstThree = joined.slice(0, 3);
  return `${firstThree}***@${emailProvider}`;
};

const VerifyOTP = ({ callback }) => {
  const navigate = useNavigate();
  const email = Cookies.get("email");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const { showErrorMessage } = Toastify();

  const handleSubmit = async () => {
    try {
      if (!email) {
        showErrorMessage({ message: "Something went wrong" });
        setTimeout(() => {
          navigate(-1);
        }, 5000);
        return;
      }

      setIsLoading(true);
      const modifyOtp = otp.join("");
      await callback(email, modifyOtp);
    } catch (error) {
      showErrorMessage({
        message: "Something went wrong. Please try later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10 pt-10">
      <div className="text-center">
        <p>Enter the 6 digit code you have received on</p>
        <p className="font-medium">{email ? modifyEmail(email) : ""}</p>
      </div>
      <OtpInput otp={otp} cb={(value) => setOtp(value)} />
      <button
        disabled={isLoading}
        onClick={handleSubmit}
        className="mt-12 auth_submit_btn auth_btn"
      >
        {isLoading ? <Loading small={true} /> : "Verify"}
      </button>
    </div>
  );
};

export default VerifyOTP;
