/* eslint-disable react/prop-types */
import { Link, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import useBuyProducts from "../../hooks/query/useBuyProducts";
import makeDateDaysAfter from "../../utils/javascript/makeDateDaysAfter";
import { useSelector } from "react-redux";
import { currencyState } from "../../redux/slice/currencySlice";

const Product = ({ product }) => {
  const searchParams = useSearchParams()[0].get("token");
  const { data } = useBuyProducts(searchParams);
  const { symbol, exchangeRate } = useSelector(currencyState);

  const {
    _id: id,
    title,
    description,
    price,
    discountPercentage,
    thumbnail,
  } = product;

  const [orderCreated, productQuantity] = useMemo(() => {
    if (!data) return null;

    const { products } = data;
    const findProduct = products.find((obj) => obj.product === id);
    return [findProduct.createdAt, findProduct.quantity];
  }, [data, id]);

  const exchangeRatePrice = Math.round(price * exchangeRate);

  const roundDiscountPercent = Math.round(discountPercentage);

  const discountedPrice = Math.round(
    (exchangeRatePrice * (100 - roundDiscountPercent)) / 100
  );

  const { pinCode, district, state, address } = data.address;

  return (
    <div className="w-full border-b-2 last:border-none p-7 flex gap-10">
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
            {discountedPrice}
          </p>
          <p className="line-through">
            {symbol}
            {exchangeRatePrice}
          </p>
          <p className="text-xs">{roundDiscountPercent}% Off</p>
        </div>
        <div className="text-xs">Qty : {productQuantity}</div>
      </section>

      {/* MARK: DELIVERY PART */}
      <div className="w-96">
        <div className="flex items-center gap-3 text-sm">
          <p>Delievered By:</p>
          <p className="text-base">{makeDateDaysAfter(orderCreated)}</p>
        </div>
        <div className="flex mt-2 gap-3 text-sm">
          <p className="whitespace-nowrap">On Address:</p>
          <div className="cursor-pointer">
            <p className="text-sm">{address}</p>
            <div className="flex">
              <p className="text-sm">{district},</p>
              <p className="ml-2 text-sm">{state}</p>
              <p className="mx-1">-</p>
              <p>{pinCode}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
