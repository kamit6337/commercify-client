import { Link } from "react-router-dom";
import OrderStatus from "./OrderStatus";
import { useEffect, useState } from "react";
import changePriceDiscountByExchangeRate from "../../utils/javascript/changePriceDiscountByExchangeRate";
import { useSelector } from "react-redux";
import { currencyState } from "../../redux/slice/currencySlice";
import makeDateFromUTC from "../../utils/javascript/makeDateFromUTC";
import useUserBuysDetails from "../../hooks/query/useUserBuysDetails";
import useUserOrders from "../../hooks/query/useUserOrders";
import Loading from "../../containers/Loading";

const UserOrders = () => {
  const { data: totalCount } = useUserBuysDetails();
  const perPage = 5;
  const totalPages = Math.floor(totalCount / perPage + 1);
  const { symbol } = useSelector(currencyState);
  const [page, setPage] = useState(1);
  const { isLoading, error, data } = useUserOrders(page);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const buys = data;

  if (data.length === 0) {
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

  const handleNextFetch = () => {
    setPage((prev) => prev + 1);
  };

  const handlePrevFetch = () => {
    setPage((prev) => prev - 1);
  };

  return (
    <>
      <section className="bg-white">
        <p className="border-b-2 py-4 px-10">Orders ({totalCount})</p>
        <main>
          {buys?.length > 0 ? (
            buys.map((buy, i) => {
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
                  key={i}
                  className="border-b-2 last:border-none p-7 sm_lap:px-4 space-y-5"
                >
                  {/* MARK: UPPER PORTION */}
                  <div className="w-full flex gap-10 sm_lap:gap-6 tablet:flex-col">
                    <div className="flex gap-10 sm_lap:gap-6">
                      <div className="h-full w-48 sm_lap:w-40">
                        <Link to={`/products/${id}`}>
                          <img
                            src={thumbnail}
                            alt={title}
                            className="h-full w-full object-cover"
                          />
                        </Link>
                      </div>
                      <section className="flex-1 flex flex-col gap-2">
                        <div>
                          <Link to={`/products/${id}`}>
                            <p>{title}</p>
                          </Link>
                          <p className="text-xs line-clamp-2">{description}</p>
                        </div>

                        <p className="text-2xl font-semibold tracking-wide">
                          {symbol}
                          {exchangeRatePrice}
                        </p>
                        <div className="text-xs">Qty : {quantity}</div>
                      </section>
                    </div>

                    <div className="space-y-2 tablet:space-y-1 whitespace-nowrap w-60 sm_lap:w-52 grow-0 shrink-0">
                      <OrderStatus {...buy} />
                      <div className="flex items-center gap-3 text-sm">
                        <p>Ordered on:</p>
                        <p className="">{makeDateFromUTC(createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* MARK: LOWER PORTION */}
                  <div className="flex justify-between items-center">
                    {/* MARK: ADDRESS */}
                    <div className="flex mt-1 gap-3 text-sm">
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

                    {/* MARK: CANCEL ORDER */}
                    <div className="flex gap-2">
                      {!isReturned && !isCancelled && isDelivered && (
                        <Link to={`/orders/return/${_id}`}>
                          <p className="cursor-pointer py-2 px-4 border rounded-md">
                            Return The Order
                          </p>
                        </Link>
                      )}
                      {!isCancelled && !isReturned && !isDelivered && (
                        <Link to={`/orders/cancel/${_id}`}>
                          <p className="cursor-pointer py-2 px-4 border rounded-md">
                            Cancel The Order
                          </p>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div>No Product</div>
          )}
        </main>
      </section>
      <div className="mt-10 h-20  text-center flex justify-center items-center">
        <div className="w-max bg-white h-full flex justify-center items-center gap-10 px-10">
          <button disabled={page === 1} onClick={handlePrevFetch}>
            Prev
          </button>
          <button disabled={totalPages === page} onClick={handleNextFetch}>
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default UserOrders;
