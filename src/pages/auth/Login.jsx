import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import validator from "validator";
import LoadingState from "../../containers/Loading";
import environment from "../../utils/environment";
import { postAuthReq } from "../../utils/api/authApi";
import Toastify from "../../lib/Toastify";
import { Helmet } from "react-helmet";
import CustomImages from "../../assets/images";

const SERVER_URL = environment.SERVER_URL;

const Login = () => {
  const navigate = useNavigate();
  const [togglePassword, setTogglePassword] = useState(false);

  const searchParams = useSearchParams()[0];
  const message = searchParams.get("msg");

  const { ToastContainer, showErrorMessage } = Toastify();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (message) {
      showErrorMessage({ message: message });
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      await postAuthReq("/login", data);

      navigate("/", { state: { message: "Successfully Logged In." } });
    } catch (error) {
      showErrorMessage({ message: error.message });
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
        <title>Login</title>
        <meta name="description" content="Login page of Commercify" />
      </Helmet>
      <div className="h-screen w-full flex flex-col justify-center items-center gap-2 bg-color_2">
        {/* NOTE: THE CENTER PAGE */}
        <div className="bg-color_1 box_shadow h-[500px] w-[600px] tablet:h-[450px] border border-color_3 rounded-xl flex flex-col justify-evenly items-center px-8 shadow-lg">
          {/* MARK: HEADLINE*/}
          <p className="text-xl font-bold tracking-wide">Login</p>
          {/* MARK: FORM AND GO TO LOGIN BUTTON*/}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 w-full text-color_1"
          >
            {/* MARK: EMAIL FIELD*/}

            <div className="flex flex-col">
              <div className="border rounded-lg">
                <input
                  type="email"
                  {...register("email", {
                    required: true,
                    validate: (value) => {
                      return validator.isEmail(value);
                    },
                  })}
                  placeholder="Email"
                  className="border  p-3 rounded-lg"
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>

              <p
                role="alert"
                className="text-xs text-red-500 pl-2 h-4 mt-[2px]"
              >
                {errors.email?.type === "required" && " Email is required"}
                {errors.email?.type === "validate" &&
                  "Please provide correct Email Id."}
              </p>
            </div>

            {/* MARK: PASSWORD FIELD*/}
            <div>
              <div className="h-12 flex justify-between items-center border rounded-lg w-full ">
                <input
                  type={togglePassword ? "text" : "password"}
                  {...register("password", { required: true })}
                  placeholder="Password"
                  className="w-full h-full rounded-l-lg px-3"
                />

                <div
                  className="text-color_4 cursor-pointer w-20 h-full flex justify-center items-center"
                  onClick={() => setTogglePassword((prev) => !prev)}
                >
                  <p>{togglePassword ? "Hide" : "Show"}</p>
                </div>
              </div>
              <p
                role="alert"
                className="text-xs text-red-500 pl-2 h-4 mt-[2px]"
              >
                {errors.password?.type === "required" &&
                  " Password is required"}
              </p>
            </div>

            {/* MARK: SUBMIT BUTTON*/}

            <div className="flex flex-col gap-2">
              <div className="border h-12 mt-8 rounded-lg bg-purple-300 font-semibold text-lg tracking-wide cursor-pointer w-full text-center ">
                {/* <Loading hScreen={false} small={true} /> */}

                {isSubmitting ? (
                  <LoadingState hScreen={false} small={true} />
                ) : (
                  <input
                    type="submit"
                    className="w-full h-full cursor-pointer"
                  />
                )}
              </div>
              <div className=" text-color_4 text-sm flex justify-between items-center">
                <p>
                  Create an account
                  <span className="ml-2 underline">
                    <Link to={`/signup`}>Sign Up</Link>
                  </span>
                </p>
              </div>
            </div>
          </form>

          {/* MARK: GO TO LOGIN PAGE*/}
          <div
            className="border rounded-lg p-3 w-full cursor-pointer font-semibold  tracking-wide flex items-center gap-2 justify-center"
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
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;
