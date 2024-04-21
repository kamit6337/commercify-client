import { Helmet } from "react-helmet";
import { useState } from "react";
import { Icons } from "../../assets/icons";
import { useRef } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../containers/Loading";
import { useForm } from "react-hook-form";
import { postAuthReq } from "../../utils/api/authApi";
import Toastify from "../../lib/Toastify";
import countries from "../../data/countries";

const PhoneLogin = () => {
  const navigate = useNavigate();
  const countryListRef = useRef(null);
  const [initialCountry, setInitialCountry] = useState("");
  const [openCountryList, setOpenCountryList] = useState(false);
  const { ToastContainer, showErrorMessage } = Toastify();

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setFocus,
  } = useForm({
    defaultValues: {
      mobile: "",
    },
  });

  // Scroll the country list to make the initial country visible when it changes
  useEffect(() => {
    if (openCountryList && countryListRef.current) {
      const initialCountryIndex = countries.findIndex(
        (obj) => obj.id === initialCountry?.id
      );
      if (initialCountryIndex !== -1) {
        const listItem = countryListRef.current.children[initialCountryIndex];
        listItem.scrollIntoView({ behavior: "instant", block: "nearest" });
      }
    }
  }, [openCountryList, initialCountry]);

  useEffect(() => {
    setFocus("mobile");
  }, [setFocus, initialCountry]);

  const handleSelectCountry = (obj) => {
    localStorage.setItem("_cou", obj.id);
    setInitialCountry(obj);
    setOpenCountryList(false);
  };

  const onSubmit = async (data) => {
    let { mobile } = data;

    if (!initialCountry) {
      showErrorMessage({ message: "You have not selected Country Code" });
      return;
    }

    mobile = initialCountry.dial_code + mobile;

    try {
      const response = await postAuthReq("/login/send-otp", {
        mobileNumber: mobile,
      });

      navigate(`/verify?token=${response.data}&callbackUrl=/`, {
        state: { mobile, login: true },
      });
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
          className="w-[600px] border rounded-xl flex flex-col justify-evenly p-8 shadow-lg"
        >
          {/* MARK: HEADLINE*/}
          <p className="text-xl font-bold tracking-wide text-center">Login</p>

          {/* MARK: MIDDLE */}
          <div className="space-y-2">
            <p className="text-sm ml-2">Enter Mobile Number </p>

            {/* MARK: ENTER NUMBER */}
            <div className="flex gap-2">
              <div className="relative">
                <div
                  className={`${
                    initialCountry ? "w-20" : "w-32"
                  }  border rounded-md flex items-center justify-center gap-1 cursor-pointer h-11 whitespace-nowrap text-xs duration-500`}
                  onClick={() => setOpenCountryList((prev) => !prev)}
                >
                  <p>
                    {openCountryList ? (
                      <Icons.downArrow className=" text-gray-400" />
                    ) : (
                      <Icons.upArrow className=" text-gray-400" />
                    )}
                  </p>
                  {initialCountry ? (
                    <p className="text-base">{initialCountry?.dial_code}</p>
                  ) : (
                    <p className="">Select Code</p>
                  )}
                </div>
                {openCountryList && (
                  <div
                    className="absolute bg-white z-10 bottom-full left-0 overflow-y-auto max-h-48 mb-1 border rounded-md w-80"
                    ref={countryListRef}
                  >
                    {countries.map((obj, i) => {
                      const { name, dial_code } = obj;

                      return (
                        <div
                          key={i}
                          className="p-2  border-b last:border-none hover:bg-gray-50 cursor-pointer text-sm"
                          onClick={() => handleSelectCountry(obj)}
                        >
                          {name} ({dial_code})
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col">
                <p className="w-full border rounded-md h-11">
                  <input
                    {...register("mobile", {
                      required: true,
                      validate: (value) => {
                        const numericPattern = /^[0-9]+$/;

                        if (!numericPattern.test(value)) {
                          return "Please enter your valid mobile number";
                        }
                        return true;
                      },
                    })}
                    className="w-full px-2 rounded-md h-full"
                    placeholder="Mobile Number"
                    autoComplete="off"
                    spellCheck="false"
                  />
                </p>
                <p className="text-red-500 text-xs h-1 ml-1">
                  {errors?.mobile?.message}
                </p>
              </div>
            </div>
          </div>

          {/* MARK: SUBMIT BUTTON*/}
          <div className="flex flex-col gap-2">
            <div className="border h-12 mt-8 rounded-lg bg-purple-300 font-semibold text-lg tracking-wide cursor-pointer w-full text-center ">
              {/* <Loading hScreen={false} small={true} /> */}

              {isSubmitting ? (
                <Loading hScreen={false} small={true} />
              ) : (
                <button
                  type="submit"
                  className="w-full h-full cursor-pointer text-slate-600"
                >
                  Request OTP
                </button>
              )}
            </div>
            <div className="text-color_4 text-sm flex justify-between items-center">
              <p>
                Create an account
                <span className="ml-2 underline">
                  <Link to={`/signup`}>Sign Up</Link>
                </span>
              </p>
            </div>
          </div>
        </form>
      </section>
      <ToastContainer />
    </>
  );
};

export default PhoneLogin;
