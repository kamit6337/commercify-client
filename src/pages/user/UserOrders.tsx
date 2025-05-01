import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import changePriceDiscountByExchangeRate from "../../utils/javascript/changePriceDiscountByExchangeRate";
import { useSelector } from "react-redux";
import { currencyState } from "../../redux/slice/currencySlice";
import makeDateFromUTC from "../../utils/javascript/makeDateFromUTC";
import useUserOrders from "@/hooks/buys/useUserOrders";
import Loading from "@/lib/Loading";
import { BUY } from "@/types";
import useUserBuysCount from "@/hooks/buys/useUserBuysCount";
import OrderStatus from "./OrderStatus";

const UserOrders = () => {
  const [page, setPage] = useState(1);
  const { isLoading, error, data } = useUserOrders(page);
  const {
    isLoading: isLoadingBuysCount,
    error: errorBuysCount,
    data: buysCount,
  } = useUserBuysCount();
  const { symbol } = useSelector(currencyState);

  // useEffect(() => {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: "smooth",
  //   });
  // }, [page]);

  if (isLoading || isLoadingBuysCount) {
    return <Loading />;
  }

  if (error || errorBuysCount) {
    return <div>{error?.message || errorBuysCount?.message}</div>;
  }

  const buys = data as BUY[];

  if (page === 1 && !data?.length) {
    return (
      <div
        className="w-full flex flex-col gap-3 items-center justify-center bg-white"
        style={{ height: "calc(100vh - 120px)" }}
      >
        <p>No orders yet.</p>
        <Link to={`/`}>
          <p className="bg-orange-600 py-2 px-10 rounded text-white">
            Start Shopping
          </p>
        </Link>
      </div>
    );
  }

  if (page > 1 && !data?.length) {
    return (
      <div
        className="w-full flex flex-col gap-3 items-center justify-center bg-white"
        style={{ height: "calc(100vh - 120px)" }}
      >
        <p>No further orders yet.</p>
      </div>
    );
  }

  const handleNextFetch = () => {
    setPage((prev) => prev + 1);
  };

  const handlePrevFetch = () => {
    setPage((prev) => prev - 1);
  };

  return (
    <>
      <section className="bg-white">
        <p className="border-b-2 py-4 px-10">Orders ({buysCount})</p>
        <main>
          {buys.map((buy) => {
            const {
              _id,
              product,
              price,
              quantity,
              address: buyAddress,
              isDelivered,
              isCancelled,
              isReturned,
              createdAt,
              exchangeRate,
            } = buy;

            const { _id: id, title, description, thumbnail } = product;

            const { country, district, state, address } = buyAddress;

            const { exchangeRatePrice } = changePriceDiscountByExchangeRate(
              price,
              0,
              exchangeRate
            );

            return (
              <div
                key={id}
                className="border-b-2 last:border-none lg:p-7 p-4 flex flex-col lg:flex-row lg:gap-10 gap-6"
              >
                {/* MARK: FIRST PORTION */}
                <div className="flex gap-10 sm_lap:gap-6">
                  <div className="h-full lg:w-48 md:w-40 w-32">
                    <Link to={`/products/${id}`}>
                      <img
                        src={thumbnail}
                        alt={title}
                        className="h-full w-full object-cover"
                      />
                    </Link>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <div>
                      <Link to={`/products/${id}`}>
                        <p>{title}</p>
                      </Link>
                      <p className="text-xs line-clamp-2 hidden">
                        {description}
                      </p>
                    </div>

                    <p className="text-2xl font-semibold tracking-wide">
                      {symbol}
                      {exchangeRatePrice}
                    </p>
                    <div className="text-xs">Qty : {quantity}</div>

                    {/* MARK: ADDRESS */}
                    <div className="flex flex-col md:flex-row mt-1 md:gap-3 gap-1 text-sm">
                      <p>Address:</p>
                      <div className="cursor-pointer">
                        <p className="text-sm">{address}</p>
                        <div className="flex">
                          <p className="text-sm">{district},</p>
                          <p className="ml-2 text-sm">{state}</p>
                          <p className="mx-1">-</p>
                          <p>{country}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* NOTE: RIGHT SIDE, DELIVERY, ORDER, CANCEL OR RETURNED */}
                <div className="flex flex-row lg:flex-col justify-between items-center w-full gap-3 whitespace-nowrap lg:w-60 ">
                  <div className="space-y-2 text-xs md:text-sm">
                    <OrderStatus {...buy} />
                    <div className="flex items-center gap-3">
                      <p>Ordered on:</p>
                      <p className="">{makeDateFromUTC(createdAt)}</p>
                    </div>
                  </div>
                  {/* MARK: CANCEL ORDER */}
                  <div className="flex gap-2 lg:mt-2">
                    {!isReturned && !isCancelled && isDelivered && (
                      <Link to={`/orders/return/${_id}`}>
                        <p className="cursor-pointer py-2 px-4 border rounded-md hover:bg-gray-200">
                          Return The Order
                        </p>
                      </Link>
                    )}
                    {!isCancelled && !isReturned && !isDelivered && (
                      <Link to={`/orders/cancel/${_id}`}>
                        <p className="cursor-pointer py-2 px-4 border rounded-md hover:bg-gray-200">
                          Cancel The Order
                        </p>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </main>
      </section>
      <div className="mt-10 h-20  text-center flex justify-center items-center">
        <div className="w-max bg-white h-full flex justify-center items-center gap-10 px-10">
          <button disabled={page === 1} onClick={handlePrevFetch}>
            Prev
          </button>
          <button disabled={!buys?.length} onClick={handleNextFetch}>
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default UserOrders;
