/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { currencyState } from "../redux/slice/currencySlice";
import changePriceDiscountByExchangeRate from "../utils/javascript/changePriceDiscountByExchangeRate";

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

  const { discountedPrice } = changePriceDiscountByExchangeRate(
    price,
    discountPercentage,
    exchangeRate
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
          <p className="text-lg font-semibold tracking-wide truncate tablet:text-base text-important_text capitalize">
            {title}
          </p>
          <p className="text-[13px] line-clamp-2 mt-1 tablet:line-clamp-2 tablet:text-xs ">
            {description}
          </p>
        </div>
        <div className="flex justify-between">
          <p className="tablet:text-sm capitalize text-some_less_important_text font-semibold tracking-wider">
            <Link to={`/category/${category._id}`}>{category.title}</Link>
          </p>
          <p className="text-important_text font-semibold tracking-wider">
            {symbol}
            {discountedPrice}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
