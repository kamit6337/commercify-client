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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Loading from "@/lib/Loading";
import useCountryStates from "@/hooks/countryAndCurrency/useCountryStates";
import useStateCities from "@/hooks/countryAndCurrency/useStateCities";
import useUserAddressCreated from "@/hooks/address/useUserAddressCreated";
import { ADDRESS } from "@/types";
import useUserAddressUpdate from "@/hooks/address/useUserAddressUpdate";

type Props = {
  handleCancel: () => void;
  address?: ADDRESS | null;
};

type Form = {
  name: string;
  mobile: string;
  address: string;
};

const NewAddressForm = ({ handleCancel, address = null }: Props) => {
  const { country, dial_code } = useSelector(currencyState);
  const [selectedCountry, setSelectedCountry] = useState(
    address ? address?.country : country
  );
  const [selectedState, setSelectedState] = useState(
    address ? address?.state : ""
  );
  const [selectedDistrict, setSelectedDistrict] = useState(
    address ? address?.district : ""
  );

  const selectedDialCode = useMemo(() => {
    const findCountry = countries.find((obj) => obj.name === selectedCountry);

    if (!findCountry) {
      return dial_code;
    }
    return findCountry.dial_code;
  }, [countries, selectedCountry]);

  const { isLoading, data, error } = useCountryStates(selectedCountry);
  const {
    isLoading: isLoadingStateCities,
    data: stateCities,
    error: errorStateCities,
  } = useStateCities(selectedState);

  const { mutate, isPending, isSuccess } = useUserAddressCreated();
  const {
    mutate: updateAddress,
    isPending: isPendingUpdateAddress,
    isSuccess: isSuccessUpdateAddress,
  } = useUserAddressUpdate(address);

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
    if (address) {
      reset({
        name: address.name,
        mobile: address.mobile,
        address: address.address,
      });
    }
  }, [address, reset]);

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

    if (address) {
      if (
        data.name === address.name &&
        data.mobile === address.mobile &&
        data.address === address.address &&
        selectedCountry === address.country &&
        selectedState === address.state &&
        selectedDistrict === address.district &&
        selectedDialCode === address.dial_code
      ) {
        showAlertMessage({ message: "Please update profile to update" });
        return;
      }
      const postData = {
        ...address,
        ...data,
        dial_code: selectedDialCode,
        country: selectedCountry,
        state: selectedState,
        district: selectedDistrict,
      };
      updateAddress(postData);
      return;
    }

    const postData = {
      ...data,
      _id: Date.now().toString(),
      dial_code: selectedDialCode,
      country: selectedCountry,
      state: selectedState,
      district: selectedDistrict,
    };

    mutate(postData);
  };

  return (
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
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger>Select Country Code</DropdownMenuTrigger>
              <DropdownMenuContent className="w-20">
                <DropdownMenuLabel>Country with Dial Code</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={selectedCountry}
                  onValueChange={(value) => setSelectedCountry(value)}
                >
                  {countries.map((obj) => {
                    const { id, name, dial_code } = obj;

                    return (
                      <DropdownMenuRadioItem key={id} value={name}>
                        {name} ({dial_code})
                      </DropdownMenuRadioItem>
                    );
                  })}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex-1 flex flex-col ">
              <p className="w-full border h-12 flex items-center border-black">
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
              <p className="text-red-500 text-xs h-4 mt-1">
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
            className="w-full bg-inherit p-4 overflow-y-hidden resize-none"
            placeholder="Address"
            rows={5}
          />
        </div>

        <div className="grid grid-cols-2 gap-x-5">
          {/* MARK: SELECT COUNTRY */}

          <Select
            value={selectedCountry}
            onValueChange={(value) => setSelectedCountry(value)}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="--select-country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((obj) => {
                const { id, name } = obj;
                return (
                  <SelectItem key={id} value={name}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {/* MARK: SELECT STATE */}
          {isLoading && <Loading height={"full"} small={true} />}
          {data && (
            <Select
              value={selectedState}
              onValueChange={(value) => setSelectedState(value)}
            >
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="--select-state" />
              </SelectTrigger>
              <SelectContent>
                {data.map((name: string, i: number) => {
                  return (
                    <SelectItem key={i} value={name}>
                      {name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-5">
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
                {data.map((name: string, i: number) => {
                  return (
                    <SelectItem key={i} value={name}>
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
