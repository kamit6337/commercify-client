import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import environment from "../../utils/environment";
import validator from "validator";
import Toastify from "../../lib/Toastify";
import LoadingState from "../../containers/Loading";
import { postAuthReq } from "../../utils/api/authApi";
import CustomImages from "../../assets/images";
import { Helmet } from "react-helmet";

const SERVER_URL = environment.SERVER_URL;

const SignUp = () => {
  const navigate = useNavigate();
  const [toggle, setToggle] = useState({
    password: false,
    confirmPassword: false,
  });

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { ToastContainer, showErrorMessage } = Toastify();

  useEffect(() => {
    if (errors.root) {
      showErrorMessage({
        message: errors.root.message || "Error in Custom SignUp",
      });
      clearErrors("root");
    }
  }, [errors.root, showErrorMessage, clearErrors]);

  const onSubmit = async (data) => {
    const formData = { ...data };
    delete formData.confirmPassword;

    try {
      await postAuthReq("/signup", formData);

      navigate("/", { state: { message: "Successfully Logged In." } });
    } catch (error) {
      setError("root", {
        message: error.message,
      });
    }
  };

  const googleOAuth = () => {
    const url = `${SERVER_URL}/auth/google`;

    const openWindow = window.open(url, "_self");

    if (!openWindow) {
      console.error("Failed to open the Google OAuth window");
    } else {
      openWindow.onerror = (event) => {
        console.error(
          "Error occurred while opening the Google OAuth window:",
          event
        );
      };
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up</title>
        <meta name="description" content="Sign Up page of Commercify" />
      </Helmet>

      <div className="h-screen w-full flex flex-col gap-2 justify-center items-center bg-color_2">
        {/* NOTE: THE CENTER PAGE */}
        <div className="bg-color_1 box_shadow  h-[600px] w-[600px] tablet:h-screen border border-color_3 rounded-xl  justify-between items-center shadow-lg   flex flex-col p-6">
          {/* MARK: FORM AND GO TO LOGIN BUTTON*/}
          <p className="text-xl font-bold tracking-wide">Sign Up</p>

          {/* MARK: SIGNUP FORM*/}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 w-full text-color_1"
          >
            {/* MARK: NAME FIELD*/}
            <div className="flex flex-col">
              <div className="border rounded-lg">
                <input
                  type="text"
                  {...register("name", {
                    required: "Name is Required",
                  })}
                  placeholder="Name"
                  className="p-3 rounded-lg w-full"
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
              <div className="border rounded-lg">
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
                  className="p-3 rounded-lg w-full"
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
              <p role="alert" className="text-xs text-red-500 pl-2 h-4">
                {errors.email && errors.email.message}
              </p>
            </div>

            {/* MARK: PASSWORD FIELD*/}
            <div>
              <div className="h-12 flex justify-between items-center border  rounded-lg ">
                <input
                  type={toggle.password ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password length should be greater than 8.",
                    },
                  })}
                  placeholder="Password"
                  className="h-full w-full px-3 rounded-l-lg"
                />

                <div
                  className="w-20 flex justify-center items-center text-color_4 cursor-pointer"
                  onClick={() =>
                    setToggle((prev) => {
                      return {
                        ...prev,
                        password: !prev.password,
                      };
                    })
                  }
                >
                  <p>{toggle.password ? "Hide" : "Show"}</p>
                </div>
              </div>
              <p role="alert" className="text-xs text-red-500 pl-2 h-4">
                {errors.password && errors.password.message}
              </p>
            </div>

            {/* MARK: CONFIRM PASSWORD FIELD*/}
            <div>
              <div className="h-12 flex justify-between items-center border rounded-lg">
                <input
                  type={toggle.confirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: true,
                    validate: (value) => {
                      return (
                        value === getValues("password") ||
                        "Passwords do not match"
                      );
                    },
                  })}
                  placeholder="Confirm Password"
                  className="h-full w-full px-3 rounded-l-lg"
                />

                <div
                  className="w-20 flex justify-center items-center text-color_4 cursor-pointer"
                  onClick={() =>
                    setToggle((prev) => {
                      return {
                        ...prev,
                        confirmPassword: !prev.confirmPassword,
                      };
                    })
                  }
                >
                  <p>{toggle.confirmPassword ? "Hide" : "Show"}</p>
                </div>
              </div>

              <p role="alert" className="text-xs text-red-500 pl-2 h-4">
                {errors.confirmPassword && errors.confirmPassword.message}
              </p>
            </div>

            {/* MARK: SUBMIT BUTTON*/}
            <div className="flex flex-col gap-2">
              <div className="h-12  rounded-lg bg-purple-300 font-semibold text-lg tracking-wide cursor-pointer w-full text-color_1">
                {isSubmitting ? (
                  <LoadingState hScreen={false} small={true} />
                ) : (
                  <input
                    type="submit"
                    className="w-full h-full cursor-pointer"
                  />
                )}
              </div>
              <p className="text-sm ml-2 text-color_4">
                Already had account
                <span className="ml-2 underline">
                  <Link to={`/login`}>Login</Link>
                </span>
              </p>
            </div>
          </form>

          {/* MARK: GO TO LOGIN PAGE*/}
          <div
            className="border rounded-lg p-3 w-full cursor-pointer font-semibold  tracking-wide text-center flex items-center gap-2 justify-center"
            onClick={googleOAuth}
          >
            <div className="w-7">
              <img
                src={CustomImages.googleIcon}
                className="w-full object-cover bg-inherit"
              />
            </div>
            <p>Login in Google</p>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default SignUp;
