import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { currencyState } from "../../redux/slice/currencySlice";
import { PRODUCT } from "@/types";
import {
  cartAndWishlistState,
  updateCart,
} from "@/redux/slice/cartAndWishlistSlice";
import Icons from "@/assets/icons";

import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import RemoveFromWishlistDialog from "./RemoveFromWishlistDialog";

type Props = {
  product: PRODUCT;
};

const Product = ({ product }: Props) => {
  const { cart } = useSelector(cartAndWishlistState);
  const { symbol } = useSelector(currencyState);
  const dispatch = useDispatch();

  const {
    _id: id,
    title,
    description,
    price: { price, discountPercentage, discountedPrice },
    thumbnail,
  } = product;

  const isAddedToCart = useMemo(() => {
    return !!cart.find((obj) => obj.id === id);
  }, [cart, id]);

  const addToCart = () => {
    dispatch(updateCart({ id }));
  };

  const removeFromCart = () => {
    dispatch(updateCart({ id, add: false }));
  };

  return (
    <div className="w-full h-48 border-b-2 last:border-none md:p-7 p-3 flex lg:gap-10 gap-5">
      <div className="h-full lg:w-48 w-40 space-y-3">
        <Link to={`/products/${id}`} className="flex justify-center h-full">
          <img src={thumbnail} alt={title} className="h-full object-cover " />
        </Link>
      </div>
      <div className="flex-1 h-full lg:mr-20 mr-0 flex flex-col gap-3">
        <div className="flex-1 space-y-2">
          <Link to={`/products/${id}`}>
            <p className="text-sm lg:text-lg font-semibold">{title}</p>
          </Link>
          <p className="hidden md:text-sm text-xs md:line-clamp-2 xl:line-clamp-3">
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
            {price}
          </p>
          <p className="text-xs">{discountPercentage}% Off</p>
        </div>
        <div className="sm:hidden flex  justify-end items-center gap-3">
          {isAddedToCart ? (
            <p
              className="border lg:p-3 lg:text-base w-max rounded-md cursor-pointer bg-gray-200 text-sm p-1"
              onClick={removeFromCart}
            >
              Added To Cart
            </p>
          ) : (
            <p
              className="border lg:p-3 lg:text-base w-max rounded-md cursor-pointer text-sm p-1"
              onClick={addToCart}
            >
              Add to Cart
            </p>
          )}
          <AlertDialog>
            <AlertDialogTrigger className="text-2xl text-gray-300 cursor-pointer">
              <Icons.deleteIcon />
            </AlertDialogTrigger>
            <RemoveFromWishlistDialog productId={id} />
          </AlertDialog>
        </div>
      </div>
      <div className="hidden sm:flex w-32 flex-col justify-between">
        <AlertDialog>
          <AlertDialogTrigger className="self-end text-2xl text-gray-300 cursor-pointer">
            <Icons.deleteIcon />
          </AlertDialogTrigger>
          <RemoveFromWishlistDialog productId={id} />
        </AlertDialog>

        {isAddedToCart ? (
          <p
            className="border p-3 w-max rounded-md cursor-pointer bg-bg_bg tablet:text-sm tablet:p-1"
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
