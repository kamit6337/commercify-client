/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { Icons } from "../../assets/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  localStorageState,
  updateCart,
  updateWishlist,
} from "../../redux/slice/localStorageSlice";
import { currencyState } from "../../redux/slice/currencySlice";
import changePriceDiscountByExchangeRate from "../../utils/javascript/changePriceDiscountByExchangeRate";

const Product = ({ product }) => {
  const { cart } = useSelector(localStorageState);
  const { symbol, exchangeRate } = useSelector(currencyState);
  const dispatch = useDispatch();
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [showRemoveFromWatchlist, setShowRemoveFromWatchlist] = useState(false);

  const {
    _id: id,
    title,
    description,
    price,
    discountPercentage,
    thumbnail,
  } = product;

  useEffect(() => {
    if (cart.find((obj) => obj.id === id)) {
      setIsAddedToCart(true);
    } else {
      setIsAddedToCart(false);
    }
  }, [id, cart]);

  const addToCart = () => {
    dispatch(updateCart({ id }));
  };

  const removeFromCart = () => {
    dispatch(updateCart({ id, add: false }));
  };

  const removeFromWatchlist = () => {
    dispatch(updateWishlist({ id, add: false }));
  };

  const { discountedPrice, exchangeRatePrice, roundDiscountPercent } =
    changePriceDiscountByExchangeRate(price, discountPercentage, exchangeRate);

  return (
    <div className="w-full h-48 border-b-2 last:border-none p-7 flex gap-10 tablet:gap-5">
      <div className="h-full w-48">
        <Link to={`/products/${id}`}>
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover"
          />
        </Link>
      </div>
      <div className="flex-1 h-full mr-20 sm_lap:mr-0 flex flex-col gap-3">
        <div>
          <Link to={`/products/${id}`}>
            <p>{title}</p>
          </Link>
          <p className="text-sm tablet:text-xs tablet:line-clamp-2">
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
      </div>
      <div className="flex flex-col justify-between">
        <div className="self-end relative">
          <p
            className="text-2xl text-gray-300 cursor-pointer"
            onClick={() => setShowRemoveFromWatchlist((prev) => !prev)}
          >
            <Icons.deleteIcon />
          </p>
          {showRemoveFromWatchlist && (
            <div className="absolute top-full right-0 z-10 px-6 py-4 border-2 bg-white rounded-md mt-4 flex flex-col gap-2 text-sm">
              <p className="whitespace-nowrap">Are you Sure</p>
              <div className="flex gap-4">
                <p
                  className="p-2 border rounded-lg cursor-pointer"
                  onClick={() => setShowRemoveFromWatchlist(false)}
                >
                  Cancel
                </p>
                <p
                  className="p-2 border rounded-lg cursor-pointer"
                  onClick={removeFromWatchlist}
                >
                  Remove
                </p>
              </div>
            </div>
          )}
        </div>
        {isAddedToCart ? (
          <p
            className="border p-3 w-max rounded-md cursor-pointer bg-gray-200 tablet:text-sm tablet:p-1"
            onClick={removeFromCart}
          >
            Added To Cart
          </p>
        ) : (
          <p
            className="border p-3 w-max rounded-md cursor-pointer tablet:text-sm tablet:p-1"
            onClick={addToCart}
          >
            Add to Cart
          </p>
        )}
      </div>
    </div>
  );
};

export default Product;
