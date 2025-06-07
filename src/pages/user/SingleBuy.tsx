import { BUY } from "@/types";
import makeDateFromUTC from "@/utils/javascript/makeDateFromUTC";
import { Link } from "react-router-dom";
import OrderStatus from "./OrderStatus";

type Props = {
  buy: BUY;
};

const SingleBuy = ({ buy }: Props) => {
  const {
    _id,
    product,
    buyPrice,
    country: {
      currency: { symbol },
    },
    quantity,
    address: buyAddress,
    isReviewed,
    isDelivered,
    isCancelled,
    isReturned,
    createdAt,
  } = buy;

  const { country, district, state, address } = buyAddress;
  const { _id: id, title, description, thumbnail } = product;

  return (
    <div
      key={id}
      className="border-b-2 last:border-none lg:p-7 p-4 flex flex-col lg:flex-row lg:justify-between lg:gap-10 gap-6"
    >
      {/* MARK: FIRST PORTION */}
      <div className="flex gap-10 ">
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
            <p className="text-xs line-clamp-2 hidden">{description}</p>
          </div>

          <p className="text-2xl font-semibold tracking-wide">
            {symbol}
            {Math.trunc(buyPrice)}
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
      <div className="flex flex-row lg:flex-col justify-between items-center w-full gap-3 whitespace-nowrap lg:w-60 grow-0 shrink-0">
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
};

export default SingleBuy;
