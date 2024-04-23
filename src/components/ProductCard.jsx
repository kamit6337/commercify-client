/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { currencyState } from "../redux/slice/currencySlice";

const ProductCard = ({ product }) => {
  const { symbol, exchangeRate } = useSelector(currencyState);

  const {
    _id,
    title,
    description,
    price,
    discountPercentage,
    category,
    thumbnail,
  } = product;

  const exchangeRatePrice = Math.round(price * exchangeRate);
  const roundDiscountPercent = Math.round(discountPercentage);
  const discountedPrice = Math.round(
    (exchangeRatePrice * (100 - roundDiscountPercent)) / 100
  );

  return (
    <div className="w-80 laptop:w-64 sm_lap:w-52 tablet:w-52 h-96 laptop:h-80 flex flex-col rounded-xl hover:shadow-2xl duration-200">
      <div className="w-full h-3/5">
        <Link to={`/products/${_id}`}>
          <img
            src={thumbnail}
            alt="product"
            loading="lazy"
            className="w-full h-full rounded-t-xl"
          />
        </Link>
      </div>
      <div className="flex-1 flex flex-col justify-between p-3 pb-4 pr-4">
        <div>
          <p className="text-lg font-semibold tracking-wide truncate tablet:text-base">
            {title}
          </p>
          <p className="text-[13px] line-clamp-2 mt-1 tablet:line-clamp-2 tablet:text-xs">
            {description}
          </p>
        </div>
        <div className="flex justify-between">
          <p className="tablet:text-sm">
            <Link to={`/category/${category._id}`}>{category.title}</Link>
          </p>
          <p>
            {symbol}
            {discountedPrice}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
