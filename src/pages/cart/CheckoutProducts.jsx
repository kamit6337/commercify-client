import Loading from "../../containers/Loading";
import useProductsFromIDs from "../../hooks/query/useProductsFromIDs";
import CheckoutProduct from "./CheckoutProduct";

const CheckoutProducts = ({ list }) => {
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
        return <CheckoutProduct key={i} product={product} />;
      })}
    </div>
  );
};

export default CheckoutProducts;
