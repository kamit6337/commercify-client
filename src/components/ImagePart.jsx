/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  localStorageState,
  updateCart,
  updateWishlist,
} from "../redux/slice/localStorageSlice";

const ImagePart = ({ images, title, id }) => {
  const dispatch = useDispatch();
  const [imageSelected, setImageSelected] = useState(images[0]);
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
    <div className="flex">
      <div className="flex flex-col">
        {images.map((img, i) => {
          return (
            <div
              key={i}
              className="w-20 border p-2"
              onClick={() => setImageSelected(img)}
            >
              <img src={img} alt={i} className="w-full object-cover" />
            </div>
          );
        })}
      </div>
      <div className="w-full">
        <div className="border w-full">
          <img
            src={imageSelected}
            alt={title}
            className="w-full object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4 text-white text-lg">
          {isAddedToCart ? (
            <p
              className=" border p-3 w-full rounded-md cursor-pointer  text-center bg-green-600"
              onClick={removeFromCart}
            >
              Added To Cart
            </p>
          ) : (
            <p
              className="border p-3 w-full rounded-md cursor-pointer text-center bg-product_addToCart"
              onClick={addToCart}
            >
              Add to Cart
            </p>
          )}
          {isAddedToWatchlist ? (
            <p
              className="border p-3 w-full rounded-md cursor-pointer bg-gray-400 text-center"
              onClick={removeFromWatchlist}
            >
              Added To Watchlist
            </p>
          ) : (
            <p
              className="border p-3 w-full rounded-md cursor-pointer text-center text-black "
              onClick={addToWatchlist}
            >
              Add to Watchlist
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePart;
