/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { currencyState } from "../../redux/slice/currencySlice";
import makeDateFromUTC from "../../utils/javascript/makeDateFromUTC";
import changePriceDiscountByExchangeRate from "../../utils/javascript/changePriceDiscountByExchangeRate";

const Product = ({ buyProduct }) => {
  const { symbol } = useSelector(currencyState);

  const { _id: id, title, description, thumbnail } = buyProduct.product;

  const { price, exchangeRate, quantity, deliveredDate } = buyProduct;

  const { country, district, state, address } = buyProduct.address;

  const { exchangeRatePrice } = changePriceDiscountByExchangeRate(
    price,
    0,
    exchangeRate
  );

  return (
    <div className="w-full border-b-2 p-7 sm_lap:p-4 flex justify-between gap-10 sm_lap:gap-5 tablet:flex-col tablet:py-10">
      <div className="flex gap-10 sm_lap:gap-5 ">
        {/* MARK: IMAGE PART */}
        <div className="h-full w-48">
          <Link to={`/products/${id}`}>
            <img
              src={thumbnail}
              alt={title}
              className="h-full w-full object-cover"
            />
          </Link>
        </div>

        {/* MARK: DETAIL PART */}

        <section className="flex-1 flex flex-col gap-3">
          <div>
            <Link to={`/products/${id}`}>
              <p>{title}</p>
            </Link>
            <p className="text-xs">{description}</p>
          </div>

          <div className="flex gap-2 items-center">
            <p className="text-2xl font-semibold tracking-wide">
              {symbol}
              {exchangeRatePrice}
            </p>
          </div>
          <div className="text-xs">Qty : {quantity}</div>
        </section>
      </div>

      {/* MARK: DELIVERY PART */}
      <div className="w-96 grow-0 shrink-0 sm_lap:w-72 tablet:w-full">
        <div className="flex items-center gap-3 text-sm">
          <p>Delievered By:</p>
          <p className="text-base">{makeDateFromUTC(deliveredDate)}</p>
        </div>
        <div className="flex mt-2 gap-3 text-sm">
          <p className="whitespace-nowrap">On Address:</p>
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
  );
};

export default Product;
