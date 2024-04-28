import { Link } from "react-router-dom";
import OrderStatus from "./OrderStatus";
import { useEffect, useState } from "react";
import changePriceDiscountByExchangeRate from "../../utils/javascript/changePriceDiscountByExchangeRate";
import { useSelector } from "react-redux";
import { currencyState } from "../../redux/slice/currencySlice";
import makeDateFromUTC from "../../utils/javascript/makeDateFromUTC";
import { Pagination, Stack } from "@mui/material";
import { userOrdersState } from "../../redux/slice/userOrdersSlice";

const UserOrders = () => {
  const perPage = 5;
  const { symbol } = useSelector(currencyState);
  const { orders } = useSelector(userOrdersState);
  const [page, setPage] = useState(1);
  const [totaPage, setTotalPage] = useState(0);
  const [buys, setBuys] = useState([]);

  useEffect(() => {
    const lengthOfBuys = orders.length;

    let calculateTotalPages;
    if (lengthOfBuys % perPage === 0) {
      calculateTotalPages = lengthOfBuys / perPage;
    } else {
      calculateTotalPages = Math.trunc(lengthOfBuys / perPage) + 1;
    }

    if (page > calculateTotalPages) return;
    const sliced = orders.slice((page - 1) * perPage, page * perPage);

    setTotalPage(calculateTotalPages);
    setBuys(sliced);
  }, [orders, page]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  const handleChange = (event, value) => {
    setPage(value);
  };

  if (!buys || buys.length === 0) {
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

  return (
    <>
      <section className="bg-white">
        <p className="border-b-2 py-4 px-10">Orders ({orders.length})</p>
        <main>
          {buys.map((buy, i) => {
            const {
              _id,
              product,
              price,
              quantity,
              address: buyAddress,
              isDelievered,
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
                className="border-b-2 last:border-none p-7 space-y-5"
              >
                {/* MARK: UPPER PORTION */}
                <div className="w-full flex gap-10 tablet:flex-col">
                  <div className="flex gap-10">
                    <div className="h-full w-48">
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
                        <p className="text-xs">{description}</p>
                      </div>

                      <p className="text-2xl font-semibold tracking-wide">
                        {symbol}
                        {exchangeRatePrice}
                      </p>
                      <div className="text-xs">Qty : {quantity}</div>
                    </section>
                  </div>

                  <div className="space-y-3 tablet:space-y-1 whitespace-nowrap w-60 grow-0 shrink-0">
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
                    {!isReturned && !isCancelled && isDelievered && (
                      <Link to={`/orders/return/${_id}`}>
                        <p className="cursor-pointer py-2 px-4 border rounded-md">
                          Return Order
                        </p>
                      </Link>
                    )}
                    {!isCancelled && !isReturned && !isDelievered && (
                      <Link to={`/orders/cancel/${_id}`}>
                        <p className="cursor-pointer py-2 px-4 border rounded-md">
                          Cancel Order
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
        <div className="w-max bg-white h-full flex justify-center items-center px-10">
          <Stack spacing={2}>
            <Pagination
              count={totaPage}
              color="primary"
              size="large"
              page={page}
              onChange={handleChange}
            />
          </Stack>
        </div>
      </div>
    </>
  );
};

export default UserOrders;
