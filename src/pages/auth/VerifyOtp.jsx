import { Helmet } from "react-helmet";
import Loading from "../../containers/Loading";
import Toastify from "../../lib/Toastify";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { postAuthReq } from "../../utils/api/authApi";
import trackAnalyticsEvent from "../../lib/trackAnalyticsEvent";
import OtpInput from "./OtpInput";
import { postReq } from "../../utils/api/api";

const VerifyOtp = () => {
  const resendOtpSeconds = 45;
  const navigate = useNavigate();
  const [resendOtpTime, setResendOtpTime] = useState(resendOtpSeconds);
  const token = useSearchParams()[0].get("token");
  const page = useSearchParams()[0].get("page");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);

  const { state } = useLocation();
  const {
    ToastContainer,
    showErrorMessage,
    showSuccessMessage,
    showAlertMessage,
  } = Toastify();

  useEffect(() => {
    if (resendOtpTime === 0) return;

    const interval = setInterval(() => {
      setResendOtpTime((prev) => {
        if (prev === 0) {
          clearInterval(interval);
          return 0; // Ensure resendOtpTime doesn't go negative
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [resendOtpTime]);

  const onSubmit = async () => {
    try {
      trackAnalyticsEvent({
        action: "verifyLogin",
        label: "Verify Login OTP",
      });

      const modifyOtp = otp.join("");

      if (modifyOtp.length < 6) {
        showAlertMessage({ message: "Please fill OTP" });
        return;
      }
      setIsLoading(true);

      if (page === "login") {
        await postAuthReq("/login/verify-otp", {
          mobileNumber: state.mobile,
          otp: modifyOtp,
          token,
        });
      } else if (page === "signup") {
        await postAuthReq("/signup/verify-otp", {
          mobileNumber: state.mobile,
          otp: otp,
          token,
        });
      } else {
        await postReq("/user/update/verify-otp", {
          mobileNumber: state.mobile,
          otp: otp,
          token,
        });
      }

      navigate("/");
    } catch (error) {
      showErrorMessage({ message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      let response;
      if (page === "login") {
        response = await postAuthReq("/login/send-otp", {
          token,
        });

        navigate(`/verify?page=login&token=${response.data}`, {
          state: { mobile: state?.mobile },
        });
      } else if (page === "signup") {
        response = await postAuthReq("/signup/send-otp", {
          token,
        });

        navigate(`/verify?page=signup&token=${response.data}`, {
          state: { mobile: state?.mobile },
        });
      } else {
        response = await postReq("/user", {
          token,
        });
        navigate(`/verify?page=update&token=${response.data}`, {
          state: { mobile: state?.mobile },
        });
      }

      showSuccessMessage({ message: "OTP send again" });
      setResendOtpTime(resendOtpSeconds);
    } catch (error) {
      showErrorMessage({ message: error.message });
    }
  };

  return (
    <>
      <Helmet>
        <title>Login</title>
        <meta name="description" content="Login page of Commercify" />
      </Helmet>
      <section className="h-screen w-full flex flex-col justify-center items-center gap-2 mobile:px-2">
        <div className="auth_div">
          {/* MARK: HEADLINE*/}
          <p className="text-xl font-bold tracking-wide text-center">
            Verify Mobile Number
          </p>

          {/* MARK: MIDDLE */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-2 text-xs">
              <p className="">
                OTP has send to mobile number ending with{" "}
                {state?.mobile.slice(-4)}
              </p>
              {page === "update" || (
                <button className="text-blue-500" onClick={() => navigate(-1)}>
                  Edit Mobile Number
                </button>
              )}
            </div>
            {/* MARK: ENTER NUMBER */}
            <OtpInput otp={otp} cb={(value) => setOtp(value)} />

            {/* MARK: RESEND OTP */}
            <div className="w-full">
              {resendOtpTime === 0 ? (
                <div className="flex justify-end">
                  <p
                    className={`text-xs cursor-pointer ml-2 hover:border-b h-5 flex items-center`}
                    onClick={handleResendOtp}
                  >
                    Resend OTP
                  </p>
                </div>
              ) : (
                <div className=" flex justify-end items-center gap-1 text-xs ml-2 h-5">
                  <p>Resend OTP after :</p>
                  <p>{resendOtpTime} sec</p>
                </div>
              )}
            </div>
          </div>

          {/* MARK: SUBMIT BUTTON*/}
          <div className="flex flex-col gap-2">
            <button
              onClick={onSubmit}
              disabled={isLoading}
              className="auth_button"
            >
              {isLoading ? (
                <Loading hScreen={false} small={true} />
              ) : (
                "Verify OTP"
              )}
            </button>
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  );
};

export default VerifyOtp;
