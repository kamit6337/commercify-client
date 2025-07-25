import { Outlet, NavLink, Link } from "react-router-dom";
import useLoginCheck from "../hooks/auth/useLoginCheck";
import Loading from "@/lib/Loading";
import useUserBuysCount from "@/hooks/buys/useUserBuysCount";
import Icons from "@/assets/icons";
import useUserAddress from "@/hooks/address/useUserAddress";

const UserLayout = () => {
  const { data: user } = useLoginCheck();
  const { isLoading, error, data } = useUserBuysCount();
  const {
    data: userAddress,
    isLoading: isLoadingUserAddress,
    error: errorUserAddress,
  } = useUserAddress();

  if (isLoading || isLoadingUserAddress) {
    return <Loading />;
  }

  if (error || errorUserAddress) {
    return <div>{error?.message || errorUserAddress?.message}</div>;
  }

  return (
    <section className="bg-bg_bg lg:px-6 px-4 py-5 flex flex-col md:flex-row md:items-start items-stretch gap-5">
      <div className="md:w-72 grow-0 shrink-0 w-full flex flex-col gap-5 md:sticky static top-[100px] ">
        {/* MARK: PROFILE */}
        <div className="bg-background p-3 px-4 flex gap-5">
          <div className="w-14">
            <img
              src={user.photo}
              alt="profile"
              loading="lazy"
              className="w-full object-cover rounded-full"
            />
          </div>
          <div className="flex flex-col justify-between py-2">
            <p className="text-xs">Hello,</p>
            <p className="text-sm font-semibold tracking-wide">{user.name}</p>
          </div>
        </div>

        {/* MARK: USER DATA */}
        <div className="bg-background">
          <div className="border-b">
            <Link to={`/user/orders`}>
              <div className="my-3 py-2 flex items-center cursor-pointer hover:bg-sky-200  dark:hover:text-blue-500">
                <p className="text-2xl text-blue-500 w-16 flex justify-center">
                  <Icons.myOrders />
                </p>
                <p className="uppercase flex-1 ">My Orders</p>
              </div>
            </Link>
          </div>
          <div className="border-b py-2">
            <div className="py-4 flex items-center">
              <p className="text-2xl text-blue-500 w-16 flex justify-center">
                <Icons.profile />
              </p>
              <p className="uppercase flex-1">Account Settings</p>
            </div>

            <div className="hover:bg-sky-200 text-sm flex dark:hover:text-blue-500">
              <NavLink
                to={`/user`}
                end
                className={({ isActive }) => {
                  return isActive
                    ? "bg-sky-200 py-2 pl-16 w-full dark:text-blue-500"
                    : "w-full py-2 pl-16";
                }}
              >
                Profile Information
              </NavLink>
            </div>

            <div className="hover:bg-sky-200 text-sm flex dark:hover:text-blue-500">
              <NavLink
                to={`/user/address`}
                className={({ isActive }) => {
                  return isActive
                    ? "bg-sky-200 w-full py-2 pl-16 dark:text-blue-500"
                    : "w-full py-2 pl-16";
                }}
              >
                Manage Addresses
              </NavLink>
            </div>
          </div>

          <div className="py-4 border-b  flex items-center">
            <p className="text-2xl text-blue-500 w-16 flex justify-center">
              <Icons.payment />
            </p>
            <p className="uppercase flex-1">Payment</p>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <Outlet context={{ count: data, user, addresses: userAddress }} />
      </div>
    </section>
  );
};

export default UserLayout;
