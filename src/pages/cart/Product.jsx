/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  localStorageState,
  updateCart,
  updateWishlist,
} from "../../redux/slice/localStorageSlice";

const Product = ({ product }) => {
  const { wishlist } = useSelector(localStorageState);
  const dispatch = useDispatch();
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);
  const [showRemoveFromCart, setShowRemoveFromCart] = useState(false);

  const {
    _id: id,
    title,
    description,
    price,
    discountPercentage,
    stock,
    brand,
    category,
    thumbnail,
  } = product;

  useEffect(() => {
    if (wishlist.includes(id)) {
      setIsAddedToWishlist(true);
    } else {
      setIsAddedToWishlist(false);
    }
  }, [id, wishlist]);

  const addToWishlist = () => {
    dispatch(updateWishlist({ id }));
  };

  const removeFromCart = () => {
    dispatch(updateCart({ id, add: false }));
    showRemoveFromCart(false);
  };

  return (
    <div className="w-full h-48 border-b-2 last:border-none p-7 flex gap-10">
      <div className="h-full w-48">
        <Link to={`/products/${id}`}>
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover"
          />
        </Link>
      </div>
      <section className="flex-1 h-full flex flex-col justify-between">
        <div className="">
          <Link to={`/products/${id}`}>
            <p>{title}</p>
            <p>{description}</p>
            <p>{price}</p>
            <p>{discountPercentage}</p>
          </Link>
        </div>

        <div className="flex gap-5 items-center">
          {isAddedToWishlist ? (
            <p className="p-1 w-max rounded-md bg-gray-200">
              Saved To Wishlist
            </p>
          ) : (
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
              onClick={() => setShowRemoveFromCart((prev) => !prev)}
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
