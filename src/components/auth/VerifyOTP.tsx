import Toastify from "@/lib/Toastify";
import modifyEmail from "@/utils/javascript/modifyEmail";
import Cookies from "js-cookie";
import { useState } from "react";
import OtpInput from "./OtpInput";
import Loading from "@/lib/Loading";
import { useNavigate } from "react-router-dom";

type Props = {
  callback: (email: string, otp: string) => Promise<void>;
};

const VerifyOTP = ({ callback }: Props) => {
  const navigate = useNavigate();
  const email = Cookies.get("email") as string;
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
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
