import ReactIcons from "@/assets/icons";
import useAdminCountDetails from "@/hooks/admin/useAdminCountDetails";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const OrderStatusLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: orderCounts } = useAdminCountDetails();

  return (
    <div className="bg-gray-100 p-5 flex gap-3 flex-col lg:flex-row lg:items-start">
      <div className="bg-white lg:w-60 w-full lg:sticky top-[100px]">
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
            pathname === "/admin/order-status/delivered" ? "text-blue-500 " : ""
          }`}
          onClick={() => navigate("/admin/order-status/delivered")}
        >
          Un-Delivered ({orderCounts.undelivered})
        </p>
        <p
          className={`py-5 border-b font-semibold text-center cursor-pointer ${
            pathname === "/admin/order-status/delivered" ? "text-blue-500 " : ""
          }`}
          onClick={() => navigate("/admin/order-status/delivered")}
        >
          Delivered ({orderCounts.delivered})
        </p>
        <p
          className={`py-5 border-b font-semibold text-center cursor-pointer ${
            pathname === "/admin/order-status/cancelled" ? "text-blue-500 " : ""
          }`}
          onClick={() => navigate("/admin/order-status/cancelled")}
        >
          Cancelled ({orderCounts.cancelled})
        </p>
        <p
          className={`py-5 border-b font-semibold text-center cursor-pointer ${
            pathname === "/admin/order-status/returned" ? "text-blue-500 " : ""
          }`}
          onClick={() => navigate("/admin/order-status/returned")}
        >
          Returned ({orderCounts.returned})
        </p>
      </div>
      <div className="flex-1 min-h-96">
        <Outlet />
      </div>
    </div>
  );
};

export default OrderStatusLayout;
