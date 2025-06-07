import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { currencyState } from "../../redux/slice/currencySlice";
import makeDateDaysAfter from "../../utils/javascript/makeDateDaysAfter";
import { PRODUCT } from "@/types";
import {
  cartAndWishlistState,
  updateProductQuantity,
  updateWishlist,
} from "@/redux/slice/cartAndWishlistSlice";
import Icons from "@/assets/icons";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import RemoveFromCartDialog from "@/components/RemoveFromCartDialog";

type Props = {
  product: PRODUCT;
  wishlist?: boolean;
};

const Product = ({ product, wishlist: isWishlist = true }: Props) => {
  const dispatch = useDispatch();
  const { symbol } = useSelector(currencyState);
  const { wishlist, cart } = useSelector(cartAndWishlistState);

  const {
    _id: id,
    title,
    description,
    price,
    thumbnail,
    deliveredBy,
  } = product;

  const isAddedToWishlist = useMemo(() => {
    return !!wishlist.find((obj) => obj.id === id);
  }, [wishlist, id]);

  const productQuantity = useMemo(() => {
    if (!id || !cart || cart.length === 0) return 1;
    const findProduct = cart.find((obj) => obj.id === id);

    if (!findProduct) return 1;
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

  const { discountedPrice, exchangeRatePrice, discountPercent } = price;

  return (
    <div className="w-full border-b-2 last:border-none lg:p-7 p-4 flex lg:gap-10 gap-5">
      <div className="flex flex-col gap-5">
        <div className="h-full lg:w-48 w-40">
          <Link to={`/products/${id}`}>
            <img
              src={thumbnail}
              alt={title}
              className="h-full w-full object-cover"
            />
          </Link>
        </div>
        <div className="flex justify-center items-center gap-2 ml-2">
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
        <div className="flex flex-col gap-3">
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
            <p className="text-xs">{discountPercent}% Off</p>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <p>Delivery</p>
            <p>-</p>
            <p>{makeDateDaysAfter(deliveredBy)}</p>
          </div>
        </div>

        <div className="flex gap-5 items-center mt-10">
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

          <AlertDialog>
            <AlertDialogTrigger>Remove</AlertDialogTrigger>
            <RemoveFromCartDialog productId={id} />
          </AlertDialog>
        </div>
      </section>
    </div>
  );
};

export default Product;
