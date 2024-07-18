/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  localStorageState,
  updateCart,
  updateWishlist,
} from "../redux/slice/localStorageSlice";

const ImagePart = ({ image, title, id }) => {
  const dispatch = useDispatch();
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isAddedToWatchlist, setIsAddedToWatchlist] = useState(false);
  const { cart, wishlist } = useSelector(localStorageState);

  useEffect(() => {
    if (cart.find((obj) => obj.id === id)) {
      setIsAddedToCart(true);
    } else {
      setIsAddedToCart(false);
    }
  }, [id, cart]);

  useEffect(() => {
    if (wishlist.includes(id)) {
      setIsAddedToWatchlist(true);
    } else {
      setIsAddedToWatchlist(false);
    }
  }, [id, wishlist]);

  const removeFromCart = () => {
    dispatch(updateCart({ id, add: false }));
  };

  const addToCart = () => {
    dispatch(updateCart({ id }));
  };

  const removeFromWatchlist = () => {
    dispatch(updateWishlist({ id, add: false }));
  };

  const addToWatchlist = () => {
    dispatch(updateWishlist({ id }));
  };

  return (
    <div className="w-full">
      <div className="border w-full h-96 flex justify-center py-2">
        <img src={image} alt={title} className="h-full object-cover" />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4 text-white text-lg sm_lap:text-base tablet:text-sm">
        {isAddedToCart ? (
          <p
            className=" border p-3 w-full  rounded-md cursor-pointer  text-center bg-green-600"
            onClick={removeFromCart}
          >
            Added To Cart
          </p>
        ) : (
          <p
            className="border p-3 w-full  rounded-md cursor-pointer text-center bg-product_addToCart"
            onClick={addToCart}
          >
            Add to Cart
          </p>
        )}
        {isAddedToWatchlist ? (
          <p
            className="border p-3 sm_lap:text-sm  w-full rounded-md cursor-pointer bg-gray-400 text-center flex items-center justify-center "
            onClick={removeFromWatchlist}
          >
            Added To Watchlist
          </p>
        ) : (
          <p
            className="  border p-3 sm_lap:text-sm w-full rounded-md cursor-pointer text-center text-black flex items-center justify-center"
            onClick={addToWatchlist}
          >
            Add to Watchlist
          </p>
        )}
      </div>
    </div>
  );
};

export default ImagePart;
