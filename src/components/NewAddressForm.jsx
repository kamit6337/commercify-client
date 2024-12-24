import { useEffect, useRef } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Toastify from "../lib/Toastify";
import Loading from "../containers/Loading";
import countries from "../data/countries";
import useCountryStates from "../hooks/query/useCountryStates";
import useStateCities from "../hooks/query/useStateCities";
import { Icons } from "../assets/icons";
import useUserAddressCreated from "../hooks/mutation/address/useUserAddressCreated";

const NewAddressForm = ({ handleCancel }) => {
  const countryListRef = useRef(null);
  const [openCountryList, setOpenCountryList] = useState(false);

  const [initialCountry, setInitialCountry] = useState(() => {
    const id = localStorage.getItem("_cou");
    if (!id) return "";
    const findCountry = countries.find((obj) => obj.id === Number(id));
    return findCountry;
  });

  const [selectedCountry, setSelectedCountry] = useState(() => {
    const countryId = localStorage.getItem("_cou");
    if (!countryId) return "";
    const findCountry = countries.find((obj) => obj.id === Number(countryId));
    return findCountry.name;
  });

  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const { isLoading, data, error } = useCountryStates(selectedCountry);

  const { mutate, isPending, isSuccess } = useUserAddressCreated();

  const {
    isLoading: isLoadingStateCities,
    data: stateCities,
    error: errorStateCities,
  } = useStateCities(selectedState);

  const {
    ToastContainer,
    showErrorMessage,
    showSuccessMessage,
    showAlertMessage,
  } = Toastify();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      mobile: "",
      address: "",
    },
  });

  useEffect(() => {
    if (isSuccess) {
      handleCancel();
      showSuccessMessage({
        message: "New Address Created",
      });
    }
  }, [isSuccess, handleCancel, showSuccessMessage]);

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
    if (error) {
      showErrorMessage({ message: "Something went wrong. Please try later" });
      return;
    }
    if (errorStateCities) {
      showErrorMessage({ message: "Something went wrong. Please try later" });
      return;
    }
  }, [error, showErrorMessage, errorStateCities]);

  const onSubmit = async (data) => {
    if (
      !initialCountry ||
      !selectedCountry ||
      !selectedState ||
      !selectedDistrict
    ) {
      showAlertMessage({ message: "Fill all the field" });
      return;
    }

    const postData = { ...data };
    postData.country = selectedCountry;
    postData.state = selectedState;
    postData.district = selectedDistrict;
    postData.dial_code = initialCountry.dial_code;

    mutate({ postData });
  };

  return (
    <>
      <div className="bg-sky-50 border">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-[700px] p-5 flex flex-col gap-10"
        >
          <p className="uppercase text-blue-600">add new address</p>
          <div className="grid grid-cols-2 gap-x-5">
            {/* MARK: TYPE NAME */}
            <div>
              <div className="border border-black h-12 flex items-center">
                <input
                  {...register("name", {
                    required: true,
                  })}
                  spellCheck="false"
                  autoComplete="off"
                  placeholder="Name"
                  className="w-full bg-inherit p-4"
                />
              </div>
              <p className="h-4 mt-1 ml-1 text-xs text-red-500">
                {errors.name?.message}
              </p>
            </div>

            {/* MARK: TYPE MOBILE */}
            <div>
              <div className="flex gap-2">
                <div className="relative">
                  <div
                    className={`${
                      initialCountry ? "w-20" : "w-32"
                    }  border border-black flex items-center justify-center gap-1 cursor-pointer h-12 whitespace-nowrap text-xs duration-500`}
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
                      className="absolute bg-white z-10 top-full left-0 overflow-y-auto max-h-48 mt-1 border w-80 tablet:w-60"
                      ref={countryListRef}
                    >
                      {countries.map((obj, i) => {
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

                <div className="flex-1 flex flex-col ">
                  <p className="w-full border h-12 flex items-center border-black">
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
                      className="w-full bg-inherit p-4"
                      placeholder="Mobile Number"
                      autoComplete="off"
                      spellCheck="false"
                    />
                  </p>
                </div>
              </div>
              <p className="text-red-500 text-xs h-4 mt-1">
                {errors?.mobile?.message}
              </p>
            </div>
          </div>

          {/* MARK: TYPE ADDRESS */}
          <div className="border border-black">
            <textarea
              {...register("address", {
                required: true,
              })}
              spellCheck="false"
              autoComplete="off"
              className="w-full bg-inherit p-4 overflow-y-hidden resize-none"
              placeholder="Address"
              rows="5"
            />
          </div>
          <div className="grid grid-cols-2 gap-x-5">
            {/* MARK: SELECT COUNTRY */}
            <div className="border border-black">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full bg-inherit p-4"
              >
                <option value={""} className="text-gray-300">
                  --select Country--
                </option>
                {countries.map((obj, i) => {
                  const { name } = obj;
                  return (
                    <option key={i} value={name}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* MARK: SELECT STATE */}
            {isLoading && <Loading hScreen={false} small={true} />}
            {data && (
              <div className="border border-black">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full bg-inherit p-4"
                >
                  <option value={""} className="text-gray-300">
                    --select State--
                  </option>
                  {data.map((obj, i) => {
                    return (
                      <option key={i} value={obj.state_name}>
                        {obj.state_name}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-x-5">
            {/* MARK: SELECT CITY OR DISTRICT */}
            {isLoadingStateCities && <Loading hScreen={false} small={true} />}
            {stateCities && (
              <div className="border border-black">
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full bg-inherit p-4"
                >
                  <option value={""} className="text-gray-300">
                    --select City/District--
                  </option>
                  {stateCities.map((obj, i) => {
                    return (
                      <option key={i} value={obj.city_name}>
                        {obj.city_name}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>

          <div className="flex gap-10 items-center h-12">
            <button
              disabled={isPending}
              className="h-full px-20 bg-sky-200 flex items-center rounded-md text-blue-700 font-semibold tracking-wide "
              type="submit"
            >
              {isPending ? <Loading small={true} /> : "Submit"}
            </button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default NewAddressForm;
