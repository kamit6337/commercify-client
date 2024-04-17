/* eslint-disable react/prop-types */
import Loading from "../../containers/Loading";
import useProductsFromIDs from "../../hooks/query/useProductsFromIDs";
import Product from "./Product";

const Products = ({ list }) => {
  const { data, isLoading, error } = useProductsFromIDs(list);

  if (isLoading) {
    return (
      <div className="h-96 w-full">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <div className=" flex flex-col border">
      {data.map((product, i) => {
        return <Product key={i} product={product} />;
      })}
    </div>
  );
};

export default Products;
