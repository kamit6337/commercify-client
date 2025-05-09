import { useEffect, useMemo } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Toastify from "../lib/Toastify";
import countries from "../data/countries";
import { useSelector } from "react-redux";
import { currencyState } from "@/redux/slice/currencySlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Loading from "@/lib/Loading";
import useCountryStates from "@/hooks/countryAndCurrency/useCountryStates";
import useStateCities from "@/hooks/countryAndCurrency/useStateCities";
import useUserAddressCreated from "@/hooks/address/useUserAddressCreated";
import { ADDRESS, COUNTRY } from "@/types";
import useUserAddressUpdate from "@/hooks/address/useUserAddressUpdate";

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

const NewAddressForm = ({ handleCancel, prevAddress = null }: Props) => {
  const { id, dial_code } = useSelector(currencyState);

  const [countryId, setCountryId] = useState<string>(id.toString());

  const selectedCountry = useMemo<COUNTRY | undefined>(() => {
    return countries.find((country) => country.id === Number(countryId));
  }, [countryId]);

  const selectedDialCode = selectedCountry?.dial_code || dial_code;

  const {
    isLoading,
    data: states,
    error,
  } = useCountryStates(selectedCountry?.name, selectedCountry?.code);

  const [stateCode, setStateCode] = useState<string>("");

  const selectedState = useMemo<STATE | null>(() => {
    if (!stateCode || !states || states.length === 0) return null;
    return states.find((state: STATE) => state.isoCode === stateCode);
  }, [stateCode, states]);

  const {
    isLoading: isLoadingStateCities,
    data: stateCities,
    error: errorStateCities,
  } = useStateCities(selectedCountry?.code, selectedState?.name, stateCode);

  const [selectedDistrict, setSelectedDistrict] = useState("");

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

      const findCountry = countries.find(
        (country) =>
          country.name.toLowerCase() === prevAddress.country.toLowerCase()
      );

      if (findCountry) {
        setCountryId(findCountry.id.toString());
      }

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
    if (!selectedCountry || !selectedState || !selectedDistrict) {
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
        selectedDistrict === prevAddress.district &&
        selectedDialCode === prevAddress.dial_code
      ) {
        showAlertMessage({ message: "Please update profile to update" });
        return;
      }
      const postData = {
        ...prevAddress,
        ...data,
        dial_code: selectedDialCode,
        country: selectedCountry.name,
        state: selectedState.name,
        district: selectedDistrict,
      };
      updateAddress(postData);
      return;
    }

    const postData = {
      ...data,
      _id: Date.now().toString(),
      dial_code: selectedDialCode,
      country: selectedCountry.name,
      state: selectedState.name,
      district: selectedDistrict,
    };

    console.log("postData", postData);
    mutate(postData);
  };

  return (
    <div className="bg-sky-50 border max-w-4xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full py-5 px-5 md:px-10  flex flex-col gap-10"
      >
        <p className="uppercase text-blue-600">add new address</p>
        <div className="flex flex-col lg:flex-row lg:items-center items-start gap-5">
          {/* MARK: TYPE NAME */}
          <div className="flex-1">
            <div className="border border-black flex items-center">
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
            <p className="h-1 mt-1 ml-1 text-xs text-red-500">
              {errors.name?.message}
            </p>
          </div>

          {/* MARK: TYPE MOBILE */}
          <div className="flex-1 flex  gap-2 items-start">
            <Select
              value={countryId}
              onValueChange={(value) => setCountryId(value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="--select-country-code" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((obj) => {
                  const { id, name, dial_code } = obj;
                  return (
                    <SelectItem key={id} value={id.toString()}>
                      {name} ({dial_code})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <div className="flex-1 flex flex-col ">
              <p className="w-full border flex items-center border-black">
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
                  className="w-full bg-inherit p-4"
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
        <div className="border border-black">
          <textarea
            {...register("address", {
              required: true,
            })}
            spellCheck="false"
            autoComplete="off"
            className="w-full bg-inherit p-4 overflow-y-hidden resize-none h-full"
            placeholder="Address"
            rows={5}
          />
        </div>

        <div className="grid grid-rows-4 items-start gap-5 lg:grid-cols-2 lg:items-center justify-between">
          {/* MARK: SELECT COUNTRY */}
          <Select
            value={countryId}
            onValueChange={(value) => setCountryId(value)}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="--select-country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((obj) => {
                const { id, name } = obj;
                return (
                  <SelectItem key={id} value={id.toString()}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {/* MARK: SELECT STATE */}
          {isLoading && <Loading height={"full"} small={true} />}

          {states && (
            <Select
              value={stateCode}
              onValueChange={(value) => setStateCode(value)}
            >
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="--select-state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((obj: { name: string; isoCode: string }) => {
                  const { name, isoCode } = obj;
                  return (
                    <SelectItem key={isoCode} value={isoCode}>
                      {name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}

          {/* MARK: SELECT CITY OR DISTRICT */}
          {isLoadingStateCities && <Loading height={"full"} small={true} />}
          {stateCities && (
            <Select
              value={selectedDistrict}
              onValueChange={(value) => setSelectedDistrict(value)}
            >
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="--select-city" />
              </SelectTrigger>
              <SelectContent>
                {stateCities.map((obj: { name: string }) => {
                  const { name } = obj;
                  return (
                    <SelectItem key={name} value={name.toLowerCase()}>
                      {name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}

          <div className="flex gap-10 items-center h-12">
            <button
              disabled={isPending || isPendingUpdateAddress}
              className="h-full px-20 bg-sky-200 flex items-center rounded-md text-blue-700 font-semibold tracking-wide "
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
