import ReactIcons from "@/assets/icons";
import useAdminCountDetails from "@/hooks/admin/useAdminCountDetails";
import Loading from "@/lib/Loading";
import timeAgoFrom from "@/utils/javascript/timeAgoFrom";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const OrderStatusLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const {
    isLoading,
    error,
    data: orderCounts,
    dataUpdatedAt,
    refetch,
  } = useAdminCountDetails("all");

  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  const handleRefresh = () => {
    setCurrentTime(Date.now());
    refetch();
  };

  return (
    <div className="bg-bg_bg p-5 flex gap-3 flex-col lg:flex-row lg:items-start">
      <div className="lg:w-60 w-full lg:sticky top-[100px] space-y-5">
        <div
          className="bg-background py-5 cursor-pointer hover:text-blue-400"
          onClick={handleRefresh}
        >
          <div className="text-sm flex justify-center items-center gap-1">
            <p>
              <ReactIcons.refresh className="text-xl" />
            </p>
            <p className="">Refresh Counts</p>
          </div>
          <p className="text-center text-xs mt-1">
            Last refresh : {timeAgoFrom(currentTime, dataUpdatedAt)}
          </p>
        </div>
        <div className="bg-background">
          <p
            className={`py-5 border-b font-semibold text-center cursor-pointer ${
              pathname.startsWith("/admin") ? "text-blue-500 " : ""
            }`}
            onClick={() => navigate("/admin")}
          >
            Admin
          </p>
          <p
            className={`py-5 border-b font-semibold text-center cursor-pointer ${
              pathname === "/admin/order-status" ? "text-blue-500 " : ""
            }`}
            onClick={() => navigate("/admin/order-status")}
          >
            Ordered ({orderCounts.ordered})
          </p>
          <p
            className={`py-5 border-b font-semibold text-center cursor-pointer ${
              pathname === "/admin/order-status/un-delivered"
                ? "text-blue-500 "
                : ""
            }`}
            onClick={() => navigate("/admin/order-status/un-delivered")}
          >
            Un-Delivered ({orderCounts.undelivered})
          </p>
          <p
            className={`py-5 border-b font-semibold text-center cursor-pointer ${
              pathname === "/admin/order-status/delivered"
                ? "text-blue-500 "
                : ""
            }`}
            onClick={() => navigate("/admin/order-status/delivered")}
          >
            Delivered ({orderCounts.delivered})
          </p>
          <p
            className={`py-5 border-b font-semibold text-center cursor-pointer ${
              pathname === "/admin/order-status/cancelled"
                ? "text-blue-500 "
                : ""
            }`}
            onClick={() => navigate("/admin/order-status/cancelled")}
          >
            Cancelled ({orderCounts.cancelled})
          </p>
          <p
            className={`py-5 border-b font-semibold text-center cursor-pointer ${
              pathname === "/admin/order-status/returned"
                ? "text-blue-500 "
                : ""
            }`}
            onClick={() => navigate("/admin/order-status/returned")}
          >
            Returned ({orderCounts.returned})
          </p>
        </div>
      </div>
      <div className="flex-1 min-h-96">
        <Outlet />
      </div>
    </div>
  );
};

export default OrderStatusLayout;
