import Toastify from "@/lib/Toastify";
import {
  cartAndWishlistState,
  updateCart,
  updateWishlist,
} from "@/redux/slice/cartAndWishlistSlice";
import { postReq } from "@/utils/api/api";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  id: string;
  isProductOutOfStock: boolean;
  noSale: boolean;
};

type NOTIFY_TYPE = "out_of_sale" | "out_of_stock";

const ImagePart = ({ id, isProductOutOfStock, noSale }: Props) => {
  const dispatch = useDispatch();
  const { cart, wishlist } = useSelector(cartAndWishlistState);
  const { showErrorMessage, showSuccessMessage } = Toastify();
  const [isPending, setIsPending] = useState(false);

  const isAddedToCart = useMemo(() => {
    if (cart.find((obj) => obj.id === id)) {
      return true;
    } else {
      return false;
    }
  }, [id, cart]);

  const isAddedToWishlist = useMemo(() => {
    if (wishlist.find((obj) => obj.id === id)) {
      return true;
    } else {
      return false;
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

  const handleNotifyUser = async (type: NOTIFY_TYPE) => {
    try {
      setIsPending(true);
      const response = await postReq("/notify", { productId: id, type });
      showSuccessMessage({ message: response });
    } catch (error) {
      showErrorMessage({
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsPending(false);
    }
  };

  // MARK: NO SALE NOTIFY
  if (noSale) {
    return (
      <>
        <div className="grid grid-cols-2 gap-4 mt-4 md:text-lg lg:text-base text-sm">
          <button
            disabled={isPending}
            className="border p-3 w-full  rounded-md cursor-pointer text-center bg-product_addToCart hover:bg-gray-100"
            onClick={() => handleNotifyUser("out_of_sale")}
          >
            Notify Me
          </button>

          {isAddedToWishlist ? (
            <button
              className="border p-3 sm_lap:text-sm  w-full rounded-md cursor-pointer bg-gray-400 text-center flex items-center justify-center hover:brightness-95"
              onClick={removeFromWatchlist}
            >
              Added To Wishlist
            </button>
          ) : (
            <button
              className="  border p-3 sm_lap:text-sm w-full rounded-md cursor-pointer text-center text-black flex items-center justify-center hover:bg-gray-100"
              onClick={addToWatchlist}
            >
              Add to Wishlist
            </button>
          )}
        </div>
      </>
    );
  }

  // MARK: PRODUCT OUT OF STOCK NOTIFY
  if (isProductOutOfStock) {
    return (
      <>
        <div className="grid grid-cols-2 gap-4 mt-4 md:text-lg lg:text-base text-sm">
          <button
            disabled={isPending}
            className="border p-3 w-full  rounded-md cursor-pointer text-center bg-product_addToCart hover:bg-gray-100"
            onClick={() => handleNotifyUser("out_of_stock")}
          >
            Notify Me
          </button>

          {isAddedToWishlist ? (
            <button
              className="border p-3 sm_lap:text-sm  w-full rounded-md cursor-pointer bg-gray-400 text-center flex items-center justify-center hover:brightness-95"
              onClick={removeFromWatchlist}
            >
              Added To Wishlist
            </button>
          ) : (
            <button
              className="  border p-3 sm_lap:text-sm w-full rounded-md cursor-pointer text-center text-black flex items-center justify-center hover:bg-gray-100"
              onClick={addToWatchlist}
            >
              Add to Wishlist
            </button>
          )}
        </div>
      </>
    );
  }

  // MARK: STOCK AND SALE IS READY
  return (
    <>
      <div className="grid grid-cols-2 gap-4 mt-4 md:text-lg lg:text-base text-sm">
        {isAddedToCart ? (
          <button
            className=" border p-3 w-full  rounded-md cursor-pointer  text-center bg-green-600"
            onClick={removeFromCart}
          >
            Added To Cart
          </button>
        ) : (
          <button
            className="border p-3 w-full  rounded-md cursor-pointer text-center bg-product_addToCart hover:bg-gray-100"
            onClick={addToCart}
          >
            Add to Cart
          </button>
        )}
        {isAddedToWishlist ? (
          <button
            className="border p-3 sm_lap:text-sm  w-full rounded-md cursor-pointer bg-gray-400 text-center flex items-center justify-center hover:brightness-95"
            onClick={removeFromWatchlist}
          >
            Added To Wishlist
          </button>
        ) : (
          <button
            className="  border p-3 sm_lap:text-sm w-full rounded-md cursor-pointer text-center text-black flex items-center justify-center hover:bg-gray-100"
            onClick={addToWatchlist}
          >
            Add to Wishlist
          </button>
        )}
      </div>
    </>
  );
};

export default ImagePart;
