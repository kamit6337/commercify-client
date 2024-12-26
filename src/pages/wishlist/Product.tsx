import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { currencyState } from "../../redux/slice/currencySlice";
import changePriceDiscountByExchangeRate from "../../utils/javascript/changePriceDiscountByExchangeRate";
import { PRODUCT } from "@/types";
import {
  cartAndWishlistState,
  updateCart,
} from "@/redux/slice/cartAndWishlistSlice";
import Icons from "@/assets/icons";

import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import RemoveFromWishlistDialog from "@/components/RemoveFromWishlistDialog";

type Props = {
  product: PRODUCT;
};

const Product = ({ product }: Props) => {
  const { cart } = useSelector(cartAndWishlistState);
  const { symbol, exchangeRate } = useSelector(currencyState);
  const dispatch = useDispatch();

  const {
    _id: id,
    title,
    description,
    price,
    discountPercentage,
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

  const { discountedPrice, exchangeRatePrice, roundDiscountPercent } =
    changePriceDiscountByExchangeRate(price, discountPercentage, exchangeRate);

  return (
    <div className="w-full h-48 border-b-2 last:border-none p-7 flex gap-10 tablet:gap-5">
      <div className="h-full w-48 sm_lap:w-40">
        <Link to={`/products/${id}`} className="flex justify-center h-full">
          <img src={thumbnail} alt={title} className="h-full object-cover " />
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
      <div className="w-32 flex flex-col justify-between">
        <AlertDialog>
          <AlertDialogTrigger className="self-end text-2xl text-gray-300 cursor-pointer">
            <Icons.deleteIcon />
          </AlertDialogTrigger>
          <RemoveFromWishlistDialog productId={id} />
        </AlertDialog>

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
