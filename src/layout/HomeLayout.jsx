import { Outlet } from "react-router-dom";
import Footer from "../containers/Footer";

const HomeLayout = () => {
  return (
    <>
      <Outlet />
      <div className="h-96 w-full">
        <Footer />
      </div>
    </>
  );
};

export default HomeLayout;
