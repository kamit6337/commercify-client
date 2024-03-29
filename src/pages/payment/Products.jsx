/* eslint-disable react/prop-types */

import Loading from "../../containers/Loading";
import useProductsFromIDs from "../../hooks/query/useProductsFromIDs";
import Product from "./Product";

const Products = ({ list, wishlist }) => {
  const { data, isLoading, error } = useProductsFromIDs(list);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <div className="flex flex-col ">
      {data.map((product, i) => {
        return <Product key={i} product={product} wishlist={wishlist} />;
      })}
    </div>
  );
};

export default Products;
