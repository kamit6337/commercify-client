import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { currencyState } from "../../redux/slice/currencySlice";
import makeDateDaysAfter from "../../utils/javascript/makeDateDaysAfter";
import changePriceDiscountByExchangeRate from "../../utils/javascript/changePriceDiscountByExchangeRate";
import { ADDRESS, PRODUCT } from "@/types";

type Product = {
  id: string;
  quantity: number;
};

type Props = {
  product: PRODUCT;
  selectedAddress: ADDRESS | null;
  cart: Product[];
};

const CheckoutProduct = ({ product, selectedAddress, cart }: Props) => {
  const { symbol, exchangeRate } = useSelector(currencyState);

  const {
    _id: id,
    title,
    description,
    price,
    discountPercentage,
    thumbnail,
    deliveredBy,
  } = product;

  const productQuantity = useMemo(() => {
    if (!id || !cart || cart.length === 0) return 1;

    const findProduct = cart.find((obj) => obj.id === id);
    if (!findProduct) return 1;
    return findProduct.quantity;
  }, [cart, id]);

  const { discountedPrice, exchangeRatePrice, roundDiscountPercent } =
    changePriceDiscountByExchangeRate(price, discountPercentage, exchangeRate);

  console.log("price", price);
  console.log("discountPercentage", discountPercentage);
  console.log("exchangeRate", exchangeRate);
  console.log("discountedPrice", discountedPrice);
  console.log("exchangeRatePrice", exchangeRatePrice);
  console.log("roundDiscountPercent", roundDiscountPercent);

  if (!selectedAddress) return;

  const { name, mobile, country, district, state, address } = selectedAddress;

  return (
    <div className="w-full border-b-2 last:border-none lg:p-7 p-4 flex lg:gap-10 gap-5">
      {/* MARK: IMAGE */}
      <div className="h-full lg:w-48 w-40">
        <Link to={`/products/${id}`}>
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover"
          />
        </Link>
      </div>

      {/* MARK: MAIN */}
      <section className="flex-1 flex flex-col gap-2">
        <div>
          <Link to={`/products/${id}`}>
            <p className="text-sm lg:text-lg font-semibold">{title}</p>
          </Link>
          <p className="md:text-sm text-xs line-clamp-2 xl:line-clamp-3 mt-1">
            {description}
          </p>
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
        <p className="text-sm text-gray-500">Qty: {productQuantity}</p>
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <p className="font-semibold">Delivery</p>
          <p>-</p>
          <p>{makeDateDaysAfter(deliveredBy)}</p>
        </div>
        <div className="flex flex-col gap-1 md:flex-row md:gap-3 text-sm text-gray-500">
          <p className="font-semibold">Address : </p>
          <div className="">
            <div className="flex items-center gap-2">
              <p className="capitalize ">{name}</p>
              <p className="">{mobile}</p>
            </div>
            <p className="break-all">{address}</p>
            <div className="flex">
              <p className="">{district},</p>
              <p className="ml-2 ">{state}</p>
              <p className="mx-1">-</p>
              <p>{country}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CheckoutProduct;
