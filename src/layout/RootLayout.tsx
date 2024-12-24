import { Outlet } from "react-router-dom";

const RootLayout = () => {
  useFindCountryAndExchangeRate();

  useGetCountryKey();

  return (
    <>
      <Outlet />
    </>
  );
};

export default RootLayout;
