import { useParams } from "react-router-dom";
import Loading from "../../containers/Loading";
import useSingleProduct from "../../hooks/query/useSingleProduct";
import ImagePart from "../../components/ImagePart";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import {
  localStorageState,
  updateCart,
  updateWishlist,
} from "../../redux/slice/localStorageSlice";

const SingleProduct = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isAddedToWatchlist, setIsAddedToWatchlist] = useState(false);
  const { cart, wishlist } = useSelector(localStorageState);

  useEffect(() => {
    if (cart.includes(id)) {
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

  const { isLoading, isError, error, data } = useSingleProduct(id);

  useEffect(() => {
    if (!data) return;
    const { title } = data.data;

    document.title = title;
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

  const { title, description, price, stock, brand, category, images } =
    data.data;

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
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>

      <section className="grid grid-cols-2 gap-5 py-16 px-6">
        <div className="">
          <ImagePart images={images} title={title} />
        </div>

        <div>
          <p>{title}</p>
          <p>{brand}</p>
          <p>{description}</p>
          <p>$ {price}</p>
          <p>{category.title}</p>
          <p>{stock}</p>
          {isAddedToCart ? (
            <p
              className="border p-3 w-max rounded-md cursor-pointer bg-gray-200"
              onClick={removeFromCart}
            >
              Added To Cart
            </p>
          ) : (
            <p
              className="border p-3 w-max rounded-md cursor-pointer"
              onClick={addToCart}
            >
              Add to Cart
            </p>
          )}
          {isAddedToWatchlist ? (
            <p
              className="border p-3 w-max rounded-md cursor-pointer bg-gray-200"
              onClick={removeFromWatchlist}
            >
              Added To Watchlist
            </p>
          ) : (
            <p
              className="border p-3 w-max rounded-md cursor-pointer"
              onClick={addToWatchlist}
            >
              Add to Watchlist
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default SingleProduct;
