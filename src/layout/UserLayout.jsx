import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Outlet />
    </div>
  );
};

export default UserLayout;
