import ClickToDeliver from "@/components/admin/order-status/ClickToDeliver";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import countries from "@/data/countries";
import OrderStatus from "@/pages/user/OrderStatus";
import { currencyState } from "@/redux/slice/currencySlice";
import { BUY } from "@/types";
import changePriceDiscountByExchangeRate from "@/utils/javascript/changePriceDiscountByExchangeRate";
import makeDateFromUTC from "@/utils/javascript/makeDateFromUTC";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

type Props = {
  buy: BUY;
};

const SingleBuy = ({ buy }: Props) => {
  const { symbol } = useSelector(currencyState);

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
    reasonForReturned,
    reasonForCancelled,
  } = buy;

  const { country, district, state, address } = buyAddress;
  const { _id: id, title, description, thumbnail } = product;

  const countrySymbol = useMemo(() => {
    if (!country) return symbol;

    const findCountry = countries.find(
      (countryObj) => countryObj.name.toLowerCase() === country.toLowerCase()
    );
    if (!findCountry) return symbol;
    return findCountry.currency.symbol;
  }, [country]);

  const { exchangeRatePrice } = changePriceDiscountByExchangeRate(
    price,
    0,
    exchangeRate
  );

  return (
    <div className="border-b-2 last:border-none lg:p-7 p-4 flex flex-col lg:flex-row lg:justify-between lg:gap-10 gap-6">
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
            {countrySymbol}
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
          {reasonForReturned && (
            <div className="flex flex-col md:gap-1 md:flex-row">
              <p className="text-red-500 whitespace-nowrap font-semibold">
                Reason :{" "}
              </p>
              <p className="text-sm md:mt-[2px] text-red-500">
                {reasonForReturned}
              </p>
            </div>
          )}
          {reasonForCancelled && (
            <div className="flex flex-col md:gap-1 md:flex-row">
              <p className="text-red-500 whitespace-nowrap font-semibold">
                Reason :{" "}
              </p>
              <p className="text-sm md:mt-[2px] text-red-500">
                {reasonForCancelled}
              </p>
            </div>
          )}
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

        <AlertDialog>
          {!isCancelled && !isReturned && !isDelivered && (
            <AlertDialogTrigger className="border rounded p-3 hover:bg-gray-50">
              Click to Deliver
            </AlertDialogTrigger>
          )}
          <ClickToDeliver buyId={_id} />
        </AlertDialog>
      </div>
    </div>
  );
};

export default SingleBuy;
