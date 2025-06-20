import { useEffect, useMemo } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Toastify from "../lib/Toastify";
import { useSelector } from "react-redux";
import { currencyState } from "@/redux/slice/currencySlice";
import Loading from "@/lib/Loading";
import useCountryStates from "@/hooks/countryAndCurrency/useCountryStates";
import useStateCities from "@/hooks/countryAndCurrency/useStateCities";
import useUserAddressCreated from "@/hooks/address/useUserAddressCreated";
import { ADDRESS, COUNTRY } from "@/types";
import useUserAddressUpdate from "@/hooks/address/useUserAddressUpdate";
import useAllCountry from "@/hooks/countryAndCurrency/useAllCountry";
import VirtualizedSelect from "./customUI/Select";
import { CountryCode, isValidPhoneNumber } from "libphonenumber-js";

type Props = {
  handleCancel: () => void;
  prevAddress?: ADDRESS | null;
};

type Form = {
  name: string;
  mobile: string;
  address: string;
};

type STATE = {
  name: string;
  isoCode: string;
};

type CITY = {
  name: string;
};

const NewAddressForm = ({ handleCancel, prevAddress = null }: Props) => {
  const { id, dial_code, country } = useSelector(currencyState);
  const { data: countries } = useAllCountry();

  const selectedCountry = useMemo<COUNTRY | undefined>(() => {
    return countries.find((country: COUNTRY) => country._id === id);
  }, [id]);

  const [stateCode, setStateCode] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  const {
    isLoading,
    data: states,
    error,
  } = useCountryStates(selectedCountry?.name, selectedCountry?.isoAlpha2);

  const selectedState = useMemo<STATE | null>(() => {
    if (!stateCode || !states || states.length === 0) return null;
    return states.find((state: STATE) => state.isoCode === stateCode);
  }, [stateCode, states]);

  const {
    isLoading: isLoadingStateCities,
    data: stateCities,
    error: errorStateCities,
  } = useStateCities(
    selectedCountry?.isoAlpha2,
    selectedState?.name,
    stateCode
  );

  const { mutate, isPending, isSuccess } = useUserAddressCreated();

  const {
    mutate: updateAddress,
    isPending: isPendingUpdateAddress,
    isSuccess: isSuccessUpdateAddress,
  } = useUserAddressUpdate(prevAddress);

  const { showErrorMessage, showSuccessMessage, showAlertMessage } = Toastify();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      mobile: "",
      address: "",
    },
  });

  useEffect(() => {
    if (prevAddress) {
      reset({
        name: prevAddress.name,
        mobile: prevAddress.mobile,
        address: prevAddress.address,
      });

      // const findCountry = countries.find(
      //   (country: COUNTRY) =>
      //     country.name.toLowerCase() === prevAddress.country.toLowerCase()
      // ) as COUNTRY;

      // if (findCountry) {
      //   setCountryId(findCountry._id.toString());
      // }

      if (states && states.length > 0) {
        const findState = states.find(
          (state: STATE) =>
            state.name.toLowerCase() === prevAddress.state.toLowerCase()
        );

        if (findState) {
          setStateCode(findState.isoCode);
        }
      }

      setSelectedDistrict(prevAddress.district.toLowerCase());
    }
  }, [prevAddress, reset, states]);

  useEffect(() => {
    if (isSuccess) {
      handleCancel();
      showSuccessMessage({
        message: "New Address Created",
      });
      return;
    }
    if (isSuccessUpdateAddress) {
      handleCancel();
      showSuccessMessage({
        message: "Address got updated",
      });
      return;
    }
  }, [isSuccess, handleCancel, showSuccessMessage, isSuccessUpdateAddress]);

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

  const onSubmit = async (data: Form) => {
    if (!selectedCountry) {
      showErrorMessage({
        message:
          "Error in creating new Address. Either refresh page or try later",
      });
      return;
    }

    const mobileWithDialCode = dial_code + data.mobile;

    if (
      !isValidPhoneNumber(
        mobileWithDialCode,
        selectedCountry?.isoAlpha2 as CountryCode
      )
    ) {
      showErrorMessage({ message: "Please type correct Mobile Number" });
      return;
    }

    if (!selectedState || !selectedDistrict) {
      showAlertMessage({ message: "Fill all the field" });
      return;
    }

    if (prevAddress) {
      if (
        data.name === prevAddress.name &&
        data.mobile === prevAddress.mobile &&
        data.address === prevAddress.address &&
        selectedCountry.name === prevAddress.country &&
        selectedState.name === prevAddress.state &&
        selectedDistrict === prevAddress.district
      ) {
        showAlertMessage({ message: "Please update profile to update" });
        return;
      }

      const postData = {
        ...prevAddress,
        ...data,
        dial_code: selectedCountry.dial_code,
        country: selectedCountry.name,
        state: selectedState.name,
        district: selectedDistrict,
        country_code: selectedCountry.isoAlpha2,
      };
      updateAddress(postData);
      return;
    }

    const postData = {
      ...data,
      _id: Date.now().toString(),
      dial_code: selectedCountry.dial_code,
      country: selectedCountry.name,
      state: selectedState.name,
      district: selectedDistrict,
      country_code: selectedCountry.isoAlpha2,
    };

    mutate(postData);
  };

  return (
    <div className="bg-sky-50 dark:bg-slate-900 border max-w-4xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full py-5 px-5 md:px-10  flex flex-col gap-10"
      >
        <p className="uppercase text-blue-600">add new address</p>
        <div className="flex flex-col lg:flex-row lg:items-center items-start gap-5">
          {/* MARK: TYPE NAME */}
          <div className="flex-1">
            <div className=" flex items-center">
              <input
                {...register("name", {
                  required: "Please provide Name",
                })}
                spellCheck="false"
                autoComplete="off"
                placeholder="Name"
                className="w-full border border-foreground rounded bg-inherit p-4"
              />
            </div>
            <p className="h-1 mt-1 ml-1 text-xs text-red-500">
              {errors.name?.message}
            </p>
          </div>

          {/* MARK: TYPE MOBILE */}
          <div className="flex-1 flex  gap-2 items-start">
            <p className="border px-3 py-2 rounded">{dial_code}</p>

            <div className="flex-1 flex flex-col ">
              <p className="w-full flex items-center">
                <input
                  {...register("mobile", {
                    required: true,
                    validate: (value) => {
                      const numericPattern = /^[0-9]+$/;

                      if (!numericPattern.test(value.toString())) {
                        return "Please enter your valid mobile number";
                      }
                      return true;
                    },
                  })}
                  className="w-full bg-inherit p-4 border border-foreground rounded"
                  placeholder="Mobile Number"
                  autoComplete="off"
                  spellCheck="false"
                />
              </p>
              <p className="text-red-500 text-xs h-1 mt-1">
                {errors?.mobile?.message}
              </p>
            </div>
          </div>
        </div>

        {/* MARK: TYPE ADDRESS */}
        <div className="">
          <textarea
            {...register("address", {
              required: "Please provide Flat no, Street or Landmark",
            })}
            spellCheck="false"
            autoComplete="off"
            className="w-full bg-inherit p-4 overflow-y-hidden resize-none h-full border border-foreground rounded"
            placeholder="Address"
            rows={5}
          />
        </div>

        <div className="grid grid-rows-4 items-start gap-5 lg:grid-cols-2 lg:items-center justify-between">
          {/* MARK: SELECT COUNTRY */}
          <p className="w-60 border py-2 px-3  rounded">{country}</p>

          {/* MARK: SELECT STATE */}
          {isLoading && <Loading height={"full"} small={true} />}

          {states && (
            <VirtualizedSelect
              items={states as STATE[]}
              triggerRenderer={(item) => {
                return <p>{item?.name || "Select State"}</p>;
              }}
              itemRenderer={(item, _, selectItem) => {
                return (
                  <p onClick={selectItem} key={item.isoCode}>
                    {item.name}
                  </p>
                );
              }}
              onSelect={(state) => setStateCode(state.isoCode)}
              mainWidth="w-60"
            />
          )}

          {/* MARK: SELECT CITY OR DISTRICT */}
          {isLoadingStateCities && <Loading height={"full"} small={true} />}

          {stateCities && (
            <VirtualizedSelect
              key={stateCode} // 👈 Force re-render when stateCode changes
              items={stateCities as CITY[]}
              triggerRenderer={(item) => {
                return <p>{item?.name || "Select City"}</p>;
              }}
              itemRenderer={(item, _, selectItem) => {
                return (
                  <p onClick={selectItem} key={item.name}>
                    {item.name}
                  </p>
                );
              }}
              onSelect={(city) => setSelectedDistrict(city.name.toLowerCase())}
              mainWidth="w-60"
            />
          )}

          <div className="flex gap-10 items-center h-12">
            <button
              disabled={isPending || isPendingUpdateAddress}
              className="h-full px-20 bg-sky-200 dark:bg-background flex items-center rounded-md text-blue-700 font-semibold tracking-wide "
              type="submit"
            >
              {isPending ? (
                <Loading small={true} />
              ) : isPendingUpdateAddress ? (
                <Loading small={true} />
              ) : (
                "Submit"
              )}
            </button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewAddressForm;
