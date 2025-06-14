import ReactIcons from "@/assets/icons";
import OrderStatusGraph from "@/components/admin/graphs/OrderStatusGraph";
import ProductsGraph from "@/components/admin/graphs/ProductsGraph";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import orderTimeScale from "@/constants/orderTimeScale";
import useAdminCountDetails from "@/hooks/admin/useAdminCountDetails";
import useOrdersCount from "@/hooks/admin/useOrdersCount";
import useProductsCount from "@/hooks/admin/useProductsCount";
import Loading from "@/lib/Loading";
import Toastify from "@/lib/Toastify";

import { TimeScale } from "@/types";
import timeAgoFrom from "@/utils/javascript/timeAgoFrom";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type CATEGORY_PRODUCT = {
  _id: string;
  title: string;
  counts: number;
};

const Admin = () => {
  const navigate = useNavigate();
  const { showErrorMessage } = Toastify();
  const [selectTimeScale, setSelectTimeScale] = useState<TimeScale>("month");
  const [currentTime, setCurrentTime] = useState(Date.now());

  const {
    data: orderCounts,
    isLoading,
    error,
    isSuccess,
    refetch: refetchAdminCountDetail,
  } = useAdminCountDetails(selectTimeScale);

  const {
    isLoading: isLoadingOrdersCount,
    error: errorOrdersCount,
    isSuccess: isSuccessOrdersCount,
    data: timeOrdersCount,
    refetch: refetchOrdersCount,
  } = useOrdersCount(selectTimeScale);

  const {
    data: categoryProducts,
    refetch: refetchProductCount,
    isLoading: isLoadingProductsCount,
    isSuccess: isSuccessProductsCount,
    dataUpdatedAt,
  } = useProductsCount();

  const totalProducts = useMemo(() => {
    if (!categoryProducts || categoryProducts.length === 0) return 0;

    return categoryProducts.reduce(
      (acc: number, category: CATEGORY_PRODUCT) => {
        return (acc += category.counts);
      },
      0
    );
  }, [categoryProducts]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (error || errorOrdersCount) {
      showErrorMessage({
        message:
          error?.message || errorOrdersCount?.message || "Something went wrong",
      });
    }
  }, [error, errorOrdersCount]);

  const handleRefresh = () => {
    setCurrentTime(Date.now());
    refetchAdminCountDetail();
    refetchOrdersCount();
    refetchProductCount();
  };

  return (
    <main className="bg-gray-100 p-5 flex gap-3 flex-col lg:flex-row lg:items-start">
      {/* MARK: SIDE NAVBAR */}

      <div className=" lg:w-60 w-full lg:sticky top-[100px] space-y-5">
        <div
          className="bg-white py-5 cursor-pointer hover:text-blue-400"
          onClick={handleRefresh}
        >
          <div className="text-sm flex justify-center items-center gap-1">
            <p>
              <ReactIcons.refresh className="text-xl" />
            </p>
            <p className="">Refresh</p>
          </div>
          <p className="text-center text-xs mt-1">
            Last refresh :{" "}
            {dataUpdatedAt
              ? timeAgoFrom(currentTime, dataUpdatedAt)
              : "Fetching..."}
          </p>
        </div>
        <div className="bg-white">
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
      </div>

      <div className="bg-white flex-1">
        {/* MARK: ORDER STATUS */}
        {(isLoading || isLoadingOrdersCount) && <Loading />}
        {isSuccess && isSuccessOrdersCount && (
          <div className="p-10 border-b-2 space-y-10">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-xl tracking-wide underline underline-offset-4">
                Order Status
              </p>
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
              timeOrdersCount={timeOrdersCount}
              selectTimeScale={selectTimeScale}
            />
          </div>
        )}

        {isLoadingProductsCount && <Loading />}
        {isSuccessProductsCount && (
          <div>
            {/* MARK: PRODUCTS */}
            <div className="p-10 space-y-10">
              <p className="font-semibold text-xl tracking-wide underline underline-offset-4">
                Products
              </p>
              <p className="bg-gray-100 p-2 rounded w-max">
                Total Products ({totalProducts})
              </p>
            </div>

            {categoryProducts?.length > 0 && (
              <div className="p-10 space-y-10">
                <p className="font-semibold text-xl tracking-wide underline underline-offset-4">
                  Category Products
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categoryProducts.map((obj: CATEGORY_PRODUCT) => {
                    const { _id, title, counts } = obj;

                    return (
                      <p
                        className="bg-gray-100 p-2 rounded capitalize"
                        key={_id}
                      >
                        {title} ({counts})
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
        )}
      </div>
    </main>
  );
};

export default Admin;
