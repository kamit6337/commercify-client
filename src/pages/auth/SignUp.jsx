import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import Helmet from "react-helmet";
import { useState } from "react";
import Cookies from "js-cookie";
import Toastify from "../../lib/Toastify";
import { postAuthReq } from "../../utils/api/authApi";
import environment from "../../utils/environment";
import CustomImages from "../../assets/images";
import { Icons } from "../../assets/icons";
import Loading from "../../containers/Loading";

const schema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"], // Set the path of the error
  });

const SignUp = () => {
  const { showErrorMessage } = Toastify();
  const navigate = useNavigate();
  const [toggle, setToggle] = useState({
    password: false,
    confirmPassword: false,
  });
  const [passwordInFocus, setPasswordInFocus] = useState(false);
  const [confirmPasswordInFocus, setConfirmPasswordInFocus] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    const formData = { ...values };
    delete formData.confirmPassword;

    try {
      await postAuthReq("/signup", formData);
      Cookies.set("email", formData.email, { expires: 1 });
      navigate("/signup/verify");
    } catch (error) {
      showErrorMessage({
        message:
          error instanceof Error ? error?.message : "Something went wrong",
      });
    }
  };

  const googleOAuth = () => {
    const url = `${environment.SERVER_URL}/auth/google`;
    const openWindow = window.open(url, "_self");

    if (!openWindow) {
      showErrorMessage({
        message:
          "Error in Google OAuth login. Try login with Email and Password",
      });
    } else {
      openWindow.onerror = () => {
        showErrorMessage({
          message:
            "Error in Google OAuth login. Try login with Email and Password",
        });
      };
    }
  };

  return (
    <>
      <Helmet>
        <title>SignUp</title>
        <meta name="discription" content="Sign up page of Voosh project" />
      </Helmet>
      {/* MARK: FORM AND GO TO LOGIN BUTTON*/}
      <p className="auth_page_title">Sign Up.</p>

      {/* MARK: GO TO OAUTH LOGIN PAGE*/}
      <div
        className="border border-auth_input_border rounded-lg py-3 w-full cursor-pointer flex justify-center items-center gap-4 hover:bg-auth_input_border"
        onClick={() => googleOAuth()}
      >
        <div className="w-6">
          <img
            src={CustomImages.googleIcon}
            alt="Google Icon"
            className="w-full object-cover bg-transparent"
          />
        </div>
        <p>Continue with Google</p>
      </div>

      <div className="w-full flex items-center gap-2 my-10">
        <div className="flex-1 h-[2px]  bg-auth_input_border" />
        <p className="text-auth_input_border">Or</p>
        <div className="flex-1 h-[2px]  bg-auth_input_border" />
      </div>

      {/* MARK: SIGNUP FORM*/}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-3">
        {/* MARK: NAME FIELD*/}
        <div className="w-full">
          <input
            type="text"
            {...register("name", {
              required: "Name is Required",
            })}
            placeholder="Name"
            className="auth_input"
            autoComplete="off"
            spellCheck="false"
          />

          <p role="alert" className="text-xs text-red-500 pl-2 h-4">
            {errors.name && errors.name.message}
          </p>
        </div>

        {/* MARK: EMAIL FIELD*/}
        <div className="w-full">
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
            })}
            placeholder="Email"
            className="auth_input"
            autoComplete="off"
            spellCheck="false"
          />

          <p role="alert" className="text-xs text-red-500 pl-2 h-4">
            {errors.email && errors.email.message}
          </p>
        </div>

        {/* MARK: PASSWORD FIELD*/}
        <div>
          <div
            className={`${
              passwordInFocus ? "border-white" : "border-auth_input_border"
            }  h-12 flex justify-between items-center border  rounded-lg w-full `}
          >
            <input
              type={toggle.password ? "text" : "password"}
              {...register("password", { required: "Password in required" })}
              placeholder="Password"
              className="auth_input_password"
              onFocus={() => setPasswordInFocus(true)}
              onBlur={() => setPasswordInFocus(false)}
            />

            <div
              className={`text-gray-300 cursor-pointer w-14 h-full flex justify-center items-center`}
              onClick={() =>
                setToggle((prev) => {
                  return {
                    ...prev,
                    password: !prev.password,
                  };
                })
              }
            >
              {toggle.password ? (
                <Icons.eyeOff className="text-xl" />
              ) : (
                <Icons.eyeOn className="text-xl" />
              )}
            </div>
          </div>
          <p role="alert" className="text-xs text-red-500 pl-2 h-4 mt-[2px]">
            {errors.password?.message}
          </p>
        </div>

        {/* MARK: CONFIRM PASSWORD FIELD*/}
        <div>
          <div
            className={`${
              confirmPasswordInFocus
                ? "border-white"
                : "border-auth_input_border"
            }  h-12 flex justify-between items-center border  rounded-lg w-full `}
          >
            <input
              type={toggle.confirmPassword ? "text" : "password"}
              {...register("confirmPassword", {
                required: "Confirm Password in required",
              })}
              placeholder="Confirm Password"
              className="auth_input_password"
              onFocus={() => setConfirmPasswordInFocus(true)}
              onBlur={() => setConfirmPasswordInFocus(false)}
            />

            <div
              className={`text-gray-300 cursor-pointer w-14 h-full flex justify-center items-center`}
              onClick={() =>
                setToggle((prev) => {
                  return {
                    ...prev,
                    confirmPassword: !prev.confirmPassword,
                  };
                })
              }
            >
              {toggle.confirmPassword ? (
                <Icons.eyeOff className="text-xl" />
              ) : (
                <Icons.eyeOn className="text-xl" />
              )}
            </div>
          </div>
          <p role="alert" className="text-xs text-red-500 pl-2 h-4 mt-[2px]">
            {errors.confirmPassword?.message}
          </p>
        </div>

        {/* MARK: SUBMIT BUTTON*/}
        <div className="space-y-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="auth_submit_btn auth_btn"
          >
            {isSubmitting ? (
              <Loading hScreen={false} small={true} />
            ) : (
              "Sign Up."
            )}
          </button>
          <div className="flex items-center justify-center gap-3">
            <p className="text-sm">Already had account?</p>
            <Link to={`/login`}>
              <p className="font-bold">Login</p>
            </Link>
          </div>
        </div>
      </form>
    </>
  );
};

export default SignUp;
