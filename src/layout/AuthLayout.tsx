import CustomImages from "@/assets/images";
import { ToastContainer } from "@/lib/Toastify";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <>
      <div className="min-h-screen h-full w-full flex justify-center pt-28 pb-10 bg-auth_background text-auth_text ">
        <div className="w-40 fixed top-0 left-[25%]">
          <img
            src={CustomImages.colorSphere}
            alt="colorSphere"
            className="w-full object-cover"
          />
        </div>
        <div className="w-24 fixed top-10 right-[28%]">
          <img
            src={CustomImages.blackSphere}
            alt="colorSphere"
            className="w-full object-cover"
          />
        </div>
        <div className="max-w-xl w-full flex flex-col items-center z-10">
          <Outlet />
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AuthLayout;
