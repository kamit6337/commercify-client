import { Link, useNavigate } from "react-router-dom";
import Loading from "../../containers/Loading";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import validator from "validator";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { postAuthReq } from "../../utils/api/authApi";
import Toastify from "../../lib/Toastify";
import { Icons } from "../../assets/icons";
import countries from "../../data/countries";

const PhoneSignUp = () => {
  const navigate = useNavigate();
  const countryListRef = useRef(null);
  const [initialCountry, setInitialCountry] = useState(() => {
    const id = localStorage.getItem("_cou");
    if (!id) return "";
    const findCountry = countries.find((obj) => obj.id === Number(id));
    return findCountry;
  });
  const [openCountryList, setOpenCountryList] = useState(false);
  const { ToastContainer, showErrorMessage } = Toastify();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
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

  const handleSelectCountry = (obj) => {
    localStorage.setItem("_cou", obj.id);
    setInitialCountry(obj);
    setOpenCountryList(false);
  };

  const onSubmit = async (data) => {
    let { name, email, mobile } = data;

    if (!initialCountry) {
      showErrorMessage({ message: "You have not selected Country Code" });
      return;
    }

    mobile = initialCountry.dial_code + mobile;

    try {
      await postAuthReq("/signup/send-otp", {
        name,
        email,
        mobile,
      });

      navigate(`/verify?page=signup`, {
        state: { mobile },
      });
    } catch (error) {
      showErrorMessage({ message: error.message });
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up</title>
        <meta name="description" content="Sign Up page of Commercify" />
      </Helmet>

      <div className="h-screen w-full flex flex-col gap-2 justify-center items-center bg-color_2 mobile:px-2">
        {/* NOTE: THE CENTER PAGE */}
        <div className="auth_div">
          {/* MARK: FORM AND GO TO LOGIN BUTTON*/}
          <p className="text-xl font-bold tracking-wide self-center">Sign Up</p>

          {/* MARK: SIGNUP FORM*/}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mobile:gap-2 w-full text-color_1"
          >
            {/* MARK: NAME FIELD*/}
            <div className="flex flex-col">
              <div className="border rounded-lg h-11 flex items-center">
                <input
                  type="text"
                  {...register("name", {
                    required: "Name is Required",
                  })}
                  placeholder="Name"
                  className="rounded-lg w-full px-2 h-full"
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
              <p role="alert" className="text-xs text-red-500 pl-2 h-4">
                {errors.name?.message}
              </p>
            </div>

            {/* MARK: EMAIL FIELD*/}
            <div className="flex flex-col">
              <div className="border rounded-lg h-11">
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    validate: (value) => {
                      return (
                        validator.isEmail(value) ||
                        "Please provide correct Email Id."
                      );
                    },
                  })}
                  placeholder="Email"
                  className="rounded-lg w-full h-full px-2"
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
              <p role="alert" className="text-xs text-red-500 pl-2 h-4">
                {errors.email && errors.email.message}
              </p>
            </div>

            {/* MARK: MOBILE NUMBER FIELD*/}
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
                    className="absolute bg-white z-10 bottom-full left-0 overflow-y-auto max-h-60 mb-1 border rounded-md w-80"
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

            {/* MARK: SUBMIT BUTTON*/}
            <div className="flex flex-col gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="auth_button"
              >
                {isSubmitting ? (
                  <Loading hScreen={false} small={true} color="white" />
                ) : (
                  "Submit"
                )}
              </button>
              <p className="text-sm ml-2 text-color_4">
                Already had account
                <span className="ml-2 underline">
                  <Link to={`/login`}>Login</Link>
                </span>
              </p>
            </div>
          </form>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default PhoneSignUp;
