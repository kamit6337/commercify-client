import { useForm } from "react-hook-form";
import useLoginCheck from "../../hooks/auth/useLoginCheck";
import { useState } from "react";
import { Icons } from "../../assets/icons";
import { Helmet } from "react-helmet";

const Profile = () => {
  const { data: user } = useLoginCheck();
  const [isEditable, setIsEditable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      password: "",
      confirmPassword: "",
    },
  });

  const handleCancel = () => {
    setIsEditable(false);

    reset({
      name: user.name,
      email: user.email,
      password: "",
      confirmPassword: "",
    });
  };

  const onSubmit = (data) => {
    console.log("data", data);
  };

  return (
    <>
      <Helmet>
        <title>My Profile</title>
        <meta name="desciption" content="User Profile in this App" />
      </Helmet>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-5 flex flex-col gap-14"
      >
        {/* MARK: PERSONAL INFO */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-10 ">
            <p>Personal Information</p>

            {isEditable ? (
              <p
                className="text-xs underline text-blue-500 cursor-pointer font-semibold tracking-wide"
                onClick={handleCancel}
              >
                Cancel
              </p>
            ) : (
              <p
                className="text-xs underline text-blue-500 cursor-pointer font-semibold tracking-wide"
                onClick={() => setIsEditable(true)}
              >
                Edit
              </p>
            )}
          </div>

          <div className="border w-max">
            <input
              type="text"
              {...register("name", {
                required: "Name is Required",
              })}
              spellCheck="false"
              autoComplete="off"
              disabled={!isEditable}
              className="p-4 text-sm "
            />
          </div>

          <p className="-mt-1 ml-1 h-4 text-xs text-red-500">
            {errors.name?.message}
          </p>
        </div>

        {/* MARK: EMAIL */}
        <div className="flex flex-col items-start gap-4">
          <p>Email Address</p>
          <div className="border">
            <input
              type="email"
              {...register("email")}
              spellCheck="false"
              autoComplete="off"
              disabled={true}
              className="p-4 text-sm "
            />
          </div>
        </div>
        {/* MARK: PASSWORD */}
        <div className="flex flex-col gap-4">
          <p>Change Password</p>
          <div className="flex gap-4">
            {/* NOTE: PASSWORD */}
            <div>
              <div className="flex items-center border ">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    minLength: {
                      value: 8,
                      message: "Password must have 8 character",
                    },
                  })}
                  spellCheck="false"
                  autoComplete="off"
                  disabled={!isEditable}
                  placeholder="Password"
                  className=" p-4 text-sm"
                />
                {isEditable && showPassword && (
                  <p
                    className="text-xl cursor-pointer mx-2"
                    onClick={() => setShowPassword(false)}
                  >
                    <Icons.eyeOff />
                  </p>
                )}

                {isEditable && !showPassword && (
                  <p
                    className="text-xl cursor-pointer mx-2"
                    onClick={() => setShowPassword(true)}
                  >
                    <Icons.eyeOn />
                  </p>
                )}
              </div>

              <p className="mt-1 ml-1 h-4 text-xs text-red-500">
                {errors.password?.message}
              </p>
            </div>

            {/* NOTE: CONFIRM PASSWORD */}
            <div>
              <div className="flex items-center border ">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    validate: (value) => {
                      if (getValues().password !== value) {
                        return "Password does not match";
                      }

                      return true;
                    },
                  })}
                  spellCheck="false"
                  autoComplete="off"
                  disabled={!isEditable}
                  placeholder="Confirm Password"
                  className=" p-4 text-sm"
                />
                {isEditable && showConfirmPassword && (
                  <p
                    className="text-xl cursor-pointer mx-2"
                    onClick={() => setShowConfirmPassword(false)}
                  >
                    <Icons.eyeOff />
                  </p>
                )}

                {isEditable && !showConfirmPassword && (
                  <p
                    className="text-xl cursor-pointer mx-2"
                    onClick={() => setShowConfirmPassword(true)}
                  >
                    <Icons.eyeOn />
                  </p>
                )}
              </div>

              <p className="mt-1 ml-1 h-4 text-xs text-red-500">
                {errors.confirmPassword?.message}
              </p>
            </div>
          </div>
        </div>

        {isEditable && (
          <div className="">
            <button
              className="px-12 py-3 bg-green-400 rounded-md w-max font-semibold tracking-wide text-green-900 "
              type="submit"
            >
              Submit
            </button>
          </div>
        )}
      </form>
    </>
  );
};

export default Profile;
