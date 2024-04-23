/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  localStorageState,
  updateCart,
  updateProductQuantity,
  updateWishlist,
} from "../../redux/slice/localStorageSlice";
import { Icons } from "../../assets/icons";
import { currencyState } from "../../redux/slice/currencySlice";

const Product = ({ product, wishlist: isWishlist = true }) => {
  const dispatch = useDispatch();
  const { symbol, exchangeRate } = useSelector(currencyState);

  const { wishlist, cart } = useSelector(localStorageState);
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);
  const [showRemoveFromCart, setShowRemoveFromCart] = useState(false);

  const {
    _id: id,
    title,
    description,
    price,
    discountPercentage,
    thumbnail,
  } = product;

  useEffect(() => {
    if (wishlist.includes(id)) {
      setIsAddedToWishlist(true);
    } else {
      setIsAddedToWishlist(false);
    }
  }, [id, wishlist]);

  const productQuantity = useMemo(() => {
    if (!id || !cart || !cart.length === 0) return null;

    const findProduct = cart.find((obj) => obj.id === id);
    return findProduct.quantity;
  }, [cart, id]);

  const decreaseQuantity = () => {
    if (productQuantity <= 1) return;
    dispatch(updateProductQuantity({ id, quantity: productQuantity - 1 }));
  };

  const increaseQuantity = () => {
    dispatch(updateProductQuantity({ id, quantity: productQuantity + 1 }));
  };

  const addToWishlist = () => {
    dispatch(updateWishlist({ id }));
  };

  const removeFromCart = () => {
    setShowRemoveFromCart(false);
    dispatch(updateCart({ id, add: false }));
  };

  const exchangeRatePrice = Math.round(price * exchangeRate);
  const roundDiscountPercent = Math.round(discountPercentage);
  const discountedPrice = Math.round(
    (exchangeRatePrice * (100 - roundDiscountPercent)) / 100
  );

  return (
    <div className="w-full border-b-2 last:border-none p-7 flex gap-10">
      <div className="flex flex-col gap-5">
        <div className="h-full w-48">
          <Link to={`/products/${id}`}>
            <img
              src={thumbnail}
              alt={title}
              className="h-full w-full object-cover"
            />
          </Link>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <p
            className="p-[6px] bg-gray-50 border rounded-full text-xs cursor-pointer"
            onClick={decreaseQuantity}
          >
            <Icons.minus />
          </p>
          <p className="border rounded-md px-5 py-1 text-sm">
            {productQuantity}
          </p>
          <div
            className="p-[6px] bg-gray-50 border rounded-full text-xs cursor-pointer"
            onClick={increaseQuantity}
          >
            <Icons.plus />
          </div>
        </div>
      </div>
      <section className="flex-1 flex flex-col justify-between">
        <div className="flex flex-col gap-2">
          <div>
            <Link to={`/products/${id}`}>
              <p>{title}</p>
            </Link>
            <p className="text-xs mt-1">{description}</p>
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

        <div className="flex gap-5 items-center">
          {isWishlist && isAddedToWishlist && (
            <p className="p-1 w-max rounded-md bg-gray-200">
              Saved To Wishlist
            </p>
          )}
          {isWishlist && !isAddedToWishlist && (
            <p
              className="p-1 w-max rounded-md cursor-pointer"
              onClick={addToWishlist}
            >
              Save to Wishlist
            </p>
          )}
          <div className="relative">
            <p
              className=" cursor-pointer"
              onClick={() => setShowRemoveFromCart(true)}
            >
              Remove
            </p>
            {showRemoveFromCart && (
              <div className="absolute bottom-full left-0 z-10 px-6 py-4 border-2 bg-white rounded-md mb-2 flex flex-col gap-2 text-sm">
                <p className="whitespace-nowrap">Are you Sure</p>
                <div className="flex gap-4">
                  <p
                    className="p-2 border rounded-lg cursor-pointer"
                    onClick={() => setShowRemoveFromCart(false)}
                  >
                    Cancel
                  </p>
                  <p
                    className="p-2 border rounded-lg cursor-pointer"
                    onClick={removeFromCart}
                  >
                    Remove
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Product;
