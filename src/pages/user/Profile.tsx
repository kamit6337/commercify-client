import { useForm } from "react-hook-form";
import { useState } from "react";
import { Helmet } from "react-helmet";
import Toastify from "../../lib/Toastify";
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Loading from "@/lib/Loading";
import useUpdateUser from "@/hooks/auth/useUpdateUser";
import { USER } from "@/types";

type OUTLET = {
  user: USER;
};

type Form = {
  name: string;
};

const Profile = () => {
  const { user } = useOutletContext<OUTLET>();
  const [isEditable, setIsEditable] = useState(false);
  const { showAlertMessage, showSuccessMessage } = Toastify();
  const { mutate, isSuccess, isPending } = useUpdateUser();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      name: user.name,
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
    });
  };

  const handleCancelOnSuccessfull = () => {
    setIsEditable(false);
  };

  const onSubmit = async (data: Form) => {
    let { name } = data;

    if (name === user.name) {
      showAlertMessage({ message: "Update Profile to Change" });
      return;
    }

    const formData = {
      ...user,
      name,
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
        className="min-h-96 p-5 flex flex-col gap-10 bg-background"
      >
        {/* MARK: PERSONAL INFO */}
        <div className="flex flex-col">
          <div className="flex items-center gap-10 mb-4">
            <p>Personal Information</p>

            {!isEditable && (
              <p
                className="text-sm underline text-blue-500 cursor-pointer font-semibold tracking-wide"
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
              className="p-4 text-sm w-full bg-background"
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

        {isEditable && (
          <div className="flex items-center gap-10">
            <button
              disabled={isPending}
              className="px-12 py-3 bg-green-400 rounded-md w-max font-semibold tracking-wide text-green-900 "
              type="submit"
            >
              {isPending ? <Loading height={"full"} small={true} /> : "Submit"}
            </button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        )}
      </form>
    </>
  );
};

export default Profile;
