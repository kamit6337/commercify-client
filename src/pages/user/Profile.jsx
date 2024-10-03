import { useForm } from "react-hook-form";
import useLoginCheck from "../../hooks/auth/useLoginCheck";
import { useState } from "react";
import { Icons } from "../../assets/icons";
import { Helmet } from "react-helmet";
import { patchReq } from "../../utils/api/api";
import Toastify from "../../lib/Toastify";
import SmallLoading from "../../containers/SmallLoading";
import { useRef } from "react";
import { useEffect } from "react";
import countryDialCode from "../../data/countryDialCode";
import { useNavigate } from "react-router-dom";
import countries from "../../data/countries";

const Profile = () => {
  const navigate = useNavigate();
  const { data: user } = useLoginCheck();
  const [isEditable, setIsEditable] = useState(false);
  const countryListRef = useRef(null);
  const [initialCountry, setInitialCountry] = useState(() => {
    const id = localStorage.getItem("_cou");
    if (!id) return "";
    const findCountry = countries.find((obj) => obj.id === Number(id));
    return findCountry;
  });
  const [openCountryList, setOpenCountryList] = useState(false);
  const { ToastContainer, showErrorMessage, showAlertMessage } = Toastify();

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      name: user.name,
      mobile: user.mobile,
    },
  });

  // Scroll the country list to make the initial country visible when it changes
  useEffect(() => {
    if (openCountryList && countryListRef.current) {
      const initialCountryIndex = countryDialCode.findIndex(
        (obj) => obj.name === initialCountry?.name
      );
      if (initialCountryIndex !== -1) {
        const listItem = countryListRef.current.children[initialCountryIndex];
        listItem.scrollIntoView({ behavior: "instant", block: "nearest" });
      }
    }
  }, [openCountryList, initialCountry]);

  useEffect(() => {
    if (isEditable) {
      const removeCodeFromUserMobile = user.mobile.replace(
        initialCountry.dial_code,
        ""
      );
      reset({
        mobile: removeCodeFromUserMobile,
      });
      return;
    }
  }, [isEditable, reset]);

  const handleCancel = () => {
    setIsEditable(false);
    reset({
      name: user.name,
      mobile: user.mobile,
    });
  };

  const handleCancelOnSuccessfull = () => {
    setIsEditable(false);
  };

  const onSubmit = async (data) => {
    let { name, mobile } = data;

    mobile = initialCountry.dial_code + mobile;

    if (name === user.name && mobile === user.mobile) {
      showAlertMessage({ message: "Update Profile to Change" });
      return;
    }

    const formData = { name, email: user.email, mobile };

    try {
      await patchReq("/user/send-otp", formData);
      handleCancelOnSuccessfull();
      navigate(`/verify`, {
        state: { mobile },
      });
    } catch (error) {
      showErrorMessage({ message: error.message || "Something went wrong" });
    }
  };

  return (
    <>
      <Helmet>
        <title>My Profile</title>
        <meta name="desciption" content="User Profile in this App" />
      </Helmet>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-5 flex flex-col gap-10 bg-white"
      >
        {/* MARK: PERSONAL INFO */}
        <div className="flex flex-col">
          <div className="flex items-center gap-10 mb-4">
            <p>Personal Information</p>

            {!isEditable && (
              <p
                className="text-xs underline text-blue-500 cursor-pointer font-semibold tracking-wide"
                onClick={() => setIsEditable(true)}
              >
                Edit
              </p>
            )}
          </div>

          <div className="border max-w-96">
            <input
              type="text"
              {...register("name", {
                required: "Name is Required",
              })}
              spellCheck="false"
              autoComplete="off"
              disabled={!isEditable}
              className="p-4 text-sm w-full"
            />
          </div>

          <p className="ml-1 h-4 text-xs text-red-500">
            {errors.name?.message}
          </p>
        </div>

        {/* MARK: EMAIL */}
        <div className="">
          <p>Email Address</p>
          <p className="border max-w-96 mt-4 p-3 text-sm">{user.email}</p>
        </div>

        {/* MARK: MOBILE NUMBER */}
        <div className="space-y-4">
          <p>Mobile Number</p>

          {isEditable ? (
            <div className="flex gap-2 max-w-96">
              <div className="relative">
                <div
                  className="border py-1 flex items-center justify-center gap-1 cursor-pointer w-20 h-11"
                  onClick={() => setOpenCountryList((prev) => !prev)}
                >
                  <p>
                    {openCountryList ? (
                      <Icons.downArrow className="text-sm text-gray-400" />
                    ) : (
                      <Icons.upArrow className="text-sm text-gray-400" />
                    )}
                  </p>
                  <p>{initialCountry?.dial_code}</p>
                </div>
                {openCountryList && (
                  <div
                    className="absolute bg-white z-10 bottom-full left-0 overflow-y-auto max-h-60 mb-1 border w-80"
                    ref={countryListRef}
                  >
                    {countryDialCode.map((obj, i) => {
                      const { name, dial_code } = obj;

                      return (
                        <div
                          key={i}
                          className="p-2  border-b last:border-none hover:bg-gray-50 cursor-pointer text-sm"
                          onClick={() => {
                            setInitialCountry(obj);
                            setOpenCountryList(false);
                          }}
                        >
                          {name} ({dial_code})
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col">
                <p className="w-full border h-11">
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
                    className="w-full px-2  h-full"
                    placeholder="Mobile Number"
                    autoComplete="off"
                    spellCheck="false"
                  />
                </p>
                <p className="text-red-500 text-xs h-4 ml-1">
                  {errors?.mobile?.message}
                </p>
              </div>
            </div>
          ) : (
            <div className="border max-w-96">
              <input
                type="text"
                {...register("mobile")}
                spellCheck="false"
                autoComplete="off"
                disabled={!isEditable}
                className="p-4 text-sm w-full"
              />
            </div>
          )}
        </div>

        {isEditable && (
          <div className="flex items-center gap-10">
            <button
              className="px-12 py-3 bg-green-400 rounded-md w-max font-semibold tracking-wide text-green-900 "
              type="submit"
            >
              {isSubmitting ? <SmallLoading /> : "Submit"}
            </button>
            <button className="" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        )}
      </form>
      <ToastContainer />
    </>
  );
};

export default Profile;
