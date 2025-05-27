import OrderStatusGraph from "@/components/admin/graphs/OrderStatusGraph";
import ProductsGraph from "@/components/admin/graphs/ProductsGraph";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAdminCountDetails from "@/hooks/admin/useAdminCountDetails";
import useProductsCount from "@/hooks/admin/useProductsCount";
import Loading from "@/lib/Loading";
import Toastify from "@/lib/Toastify";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type CATEGORY_PRODUCT = {
  _id: string;
  title: string;
  categoryProductsCount: number;
};

type TimeScale = "day" | "month" | "year" | "6month";

type OrderTimeScale = {
  title: string;
  time: TimeScale;
};

const orderTimeScale: OrderTimeScale[] = [
  {
    title: "Last 1 Day",
    time: "day",
  },
  {
    title: "Last 1 Month",
    time: "month",
  },
  {
    title: "Last 6 Months",
    time: "6month",
  },
  {
    title: "Last 1 Year",
    time: "year",
  },
];

const Admin = () => {
  const navigate = useNavigate();
  const { showErrorMessage } = Toastify();
  const [selectTimeScale, setSelectTimeScale] = useState<TimeScale>("month");
  const {
    data: orderCounts,
    isLoading,
    error,
    isSuccess,
  } = useAdminCountDetails(true, selectTimeScale);

  const { data: productCounts } = useProductsCount();

  const categoryProducts = productCounts.categoryProducts;

  useEffect(() => {
    if (error) {
      showErrorMessage({ message: error.message });
    }
  }, [error]);

  return (
    <main className="bg-gray-100 p-5 flex gap-3 flex-col lg:flex-row lg:items-start">
      {/* MARK: SIDE NAVBAR */}

      <div className="bg-white lg:w-60 w-full lg:sticky top-[100px]">
        <p
          className="py-5 border-b font-semibold text-center cursor-pointer"
          onClick={() => navigate("/admin/order-status")}
        >
          Order Status
        </p>
        <p
          className="py-5 border-b font-semibold text-center cursor-pointer"
          onClick={() => navigate("/admin/products")}
        >
          Products
        </p>
        <p
          className="py-5 font-semibold text-center cursor-pointer"
          onClick={() => navigate("/admin/products")}
        >
          Categories
        </p>
      </div>

      <div className="bg-white flex-1">
        {/* MARK: ORDER STATUS */}
        {isLoading && <Loading />}
        {isSuccess && (
          <div className="p-10 border-b-2 space-y-10">
            <div className="flex items-center justify-between">
              <p>Order Status</p>
              <Select
                value={selectTimeScale}
                onValueChange={(value) =>
                  setSelectTimeScale(value as TimeScale)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Time Scale" />
                </SelectTrigger>
                <SelectContent>
                  {orderTimeScale.map((timeScale, i) => {
                    return (
                      <SelectItem key={i} value={timeScale.time}>
                        {timeScale.title}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <p className="bg-gray-100 p-2 rounded">
                Ordered ({orderCounts.ordered})
              </p>
              <p className="bg-gray-100 p-2 rounded">
                Un-Delievered ({orderCounts.undelivered})
              </p>
              <p className="bg-gray-100 p-2 rounded">
                Delievered ({orderCounts.delivered})
              </p>
              <p className="bg-gray-100 p-2 rounded">
                Cancelled ({orderCounts.cancelled})
              </p>
              <p className="bg-gray-100 p-2 rounded">
                Returned ({orderCounts.returned})
              </p>
            </div>
            <OrderStatusGraph
              orderCounts={orderCounts}
              topLabel={
                orderTimeScale.find(
                  (timeScale) => timeScale.time === selectTimeScale
                )?.title
              }
            />
          </div>
        )}

        {/* MARK: PRODUCTS */}
        <div className="p-10 space-y-10">
          <p>Products</p>
          <p className="bg-gray-100 p-2 rounded w-max">
            Total Products ({productCounts.products})
          </p>
        </div>

        {categoryProducts?.length > 0 && (
          <div className="p-10 space-y-10">
            <p>Category Products</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categoryProducts.map((obj: CATEGORY_PRODUCT) => {
                const { _id, title, categoryProductsCount } = obj;

                return (
                  <p className="bg-gray-100 p-2 rounded capitalize" key={_id}>
                    {title} ({categoryProductsCount})
                  </p>
                );
              })}
            </div>
          </div>
        )}
        <div className="p-10">
          <ProductsGraph />
        </div>
      </div>
    </main>
  );
};

export default Admin;
