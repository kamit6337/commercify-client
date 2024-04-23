import { Helmet } from "react-helmet";
import Loading from "../../containers/Loading";
import { useForm } from "react-hook-form";
import Toastify from "../../lib/Toastify";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { postAuthReq } from "../../utils/api/authApi";
import { patchReq } from "../../utils/api/api";

const VerifyOtp = () => {
  const resendOtpSeconds = 45;
  const navigate = useNavigate();
  const [resendOtpTime, setResendOtpTime] = useState(resendOtpSeconds);
  const token = useSearchParams()[0].get("token");
  const { state } = useLocation();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setFocus,
  } = useForm({
    defaultValues: {
      otp: "",
    },
  });

  const { ToastContainer, showErrorMessage, showSuccessMessage } = Toastify();

  useEffect(() => {
    setFocus("otp");
  }, [setFocus]);

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

  const onSubmit = async (data) => {
    const { otp } = data;

    try {
      if (state?.login) {
        const response = await postAuthReq("/login/verify-otp", {
          mobileNumber: state.mobile,
          otp: otp,
          token,
        });

        console.log("response", response);

        navigate("/");
        return;
      }

      if (state?.signup) {
        await postAuthReq("/signup/verify-otp", {
          mobileNumber: state.mobile,
          otp: otp,
          token,
        });
        navigate("/");
        return;
      }

      await patchReq("/user", {
        mobileNumber: state.mobile,
        otp: otp,
        token,
      });
      navigate("/");
    } catch (error) {
      showErrorMessage({ message: error.message });
    }
  };

  const handleResendOtp = async () => {
    try {
      if (state?.login) {
        const response = await postAuthReq("/login/send-otp", {
          token,
        });

        navigate(`/verify?token=${response.data}`, {
          state: { mobile: state?.mobile, login: true },
        });
        showSuccessMessage({ message: "OTP send again" });
        setResendOtpTime(resendOtpSeconds);
        return;
      }

      if (state?.signup) {
        const response = await postAuthReq("/signup/send-otp", {
          token,
        });

        navigate(`/verify?token=${response.data}`, {
          state: { mobile: state?.mobile, signup: true },
        });
        showSuccessMessage({ message: "OTP send again" });
        setResendOtpTime(resendOtpSeconds);
        return;
      }

      if (state?.update) {
        const response = await postAuthReq("/user", {
          token,
        });

        navigate(`/verify?token=${response.data}`, {
          state: { mobile: state?.mobile, update: true },
        });
        showSuccessMessage({ message: "OTP send again" });
        setResendOtpTime(resendOtpSeconds);
        return;
      }
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
      <section className="h-screen w-full flex flex-col justify-center items-center gap-2">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[600px]  border rounded-xl flex flex-col gap-10 justify-evenly p-6 shadow-lg"
        >
          {/* MARK: HEADLINE*/}
          <p className="text-xl font-bold tracking-wide text-center">
            Verify Mobile Number
          </p>

          {/* MARK: MIDDLE */}
          <div className="space-y-1">
            <div className="flex justify-between items-center px-2 text-xs">
              <p className="">
                OTP has send to mobile number ending with{" "}
                {state?.mobile.slice(-4)}
              </p>
              {state?.update || (
                <button
                  className="text-blue-500"
                  onClick={() => navigate("/login")}
                >
                  Edit Mobile Number
                </button>
              )}
            </div>
            {/* MARK: ENTER NUMBER */}
            <div className="">
              <p className="w-full border rounded-md h-9">
                <input
                  {...register("otp", {
                    required: true,
                    validate: (value) => {
                      const numericPattern = /^[0-9]+$/;

                      if (!numericPattern.test(value)) {
                        return "Please enter your valid mobile number";
                      }

                      if (String(value).length > 6) {
                        return "Please provide a valid 6 digit OTP";
                      }

                      return true;
                    },
                  })}
                  className="w-full px-2 rounded-md h-full"
                  placeholder="6-digit OTP"
                  autoComplete="off"
                  spellCheck="false"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // Prevent form submission
                      return;
                    }
                  }}
                />
              </p>
              <p className="text-red-500 text-[10px] h-1 ml-1">
                {errors?.otp?.message}
              </p>
            </div>

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
            <div className="border rounded-lg bg-purple-300 font-semibold text-lg tracking-wide cursor-pointer w-full text-center h-12 ">
              {isSubmitting ? (
                <Loading hScreen={false} small={true} />
              ) : (
                <button
                  type="submit"
                  className="w-full h-full cursor-pointer text-slate-600"
                >
                  Verify OTP
                </button>
              )}
            </div>
          </div>
        </form>
      </section>
      <ToastContainer />
    </>
  );
};

export default VerifyOtp;
