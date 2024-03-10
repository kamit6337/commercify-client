import React from "react";
import Loading from "../../containers/Loading";
import FullPageError from "../../components/FullPageError";
import ProductInCart from "../cart/components/ProductInCart";
import { Link } from "react-router-dom";
import useGetWishlist from "../../hooks/useGetWishlist";

const UserWatchlist = () => {
  const { data, isLoading, isError, error } = useGetWishlist();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <FullPageError errMsg={error.message} />;
  }

  return (
    <div className="flex flex-col gap-8">
      {data?.data.data.length > 0 ? (
        data?.data.data.map((product, i) => {
          return (
            <ProductInCart
              key={i}
              product={product}
              buttonText={"Remove from Wishlist"}
              wishlist={true}
            />
          );
        })
      ) : (
        <div>
          <p>Your Wishlist is empty</p>
          <div className="p-3 border border-black rounded-xl mt-10 w-max">
            <Link to={`/`}>Go Back to Home Page</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserWatchlist;
