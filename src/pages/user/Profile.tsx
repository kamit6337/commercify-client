import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import Toastify from "../../lib/Toastify";
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import countries from "../../data/countries";
import { USER } from "@/types";
import { useSelector } from "react-redux";
import { currencyState } from "@/redux/slice/currencySlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Loading from "@/lib/Loading";
import useUpdateUser from "@/hooks/auth/useUpdateUser";

type OUTLET = {
  user: USER;
};

type Form = {
  name: string;
  mobile: string;
};

const Profile = () => {
  const { user } = useOutletContext<OUTLET>();
  const { id, dial_code } = useSelector(currencyState);
  const [countryId, setCountryId] = useState(id);
  const [isEditable, setIsEditable] = useState(false);
  const { showAlertMessage, showSuccessMessage } = Toastify();
  const { mutate, isSuccess, isPending } = useUpdateUser();
  const selectedCountry = useMemo(() => {
    const findCountry = countries.find((obj) => obj.id === countryId);

    if (!findCountry) {
      return {
        id,
        dial_code,
      };
    }
    return findCountry;
  }, [countries, countryId]);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      name: user.name,
      mobile: user.mobile,
    },
  });

  useEffect(() => {
    if (isSuccess) {
      showSuccessMessage({ message: "User Profile updated" });
      handleCancelOnSuccessfull();
    }
  }, [isSuccess]);

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

  const onSubmit = async (data: Form) => {
    let { name, mobile } = data;

    mobile = selectedCountry.dial_code + mobile;

    if (name === user.name && mobile === user.mobile) {
      showAlertMessage({ message: "Update Profile to Change" });
      return;
    }

    const formData = {
      ...user,
      name,
      mobile,
      dial_code: selectedCountry.dial_code,
    };

    mutate(formData);
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
              <DropdownMenu>
                <DropdownMenuTrigger>Select Country Code</DropdownMenuTrigger>
                <DropdownMenuContent className="w-20">
                  <DropdownMenuLabel>Country with Dial Code</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={countryId.toString()}
                    onValueChange={(value) => setCountryId(Number(value))}
                  >
                    {countries.map((obj) => {
                      const { id, name, dial_code } = obj;

                      return (
                        <DropdownMenuRadioItem key={id} value={id.toString()}>
                          {name} ({dial_code})
                        </DropdownMenuRadioItem>
                      );
                    })}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

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
              disabled={isPending}
              className="px-12 py-3 bg-green-400 rounded-md w-max font-semibold tracking-wide text-green-900 "
              type="submit"
            >
              {isPending ? <Loading height={"full"} small={true} /> : "Submit"}
            </button>
            <button className="" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        )}
      </form>
    </>
  );
};

export default Profile;
