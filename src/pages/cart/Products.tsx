import useProductsFromIDs from "@/hooks/products/useProductsFromIDs";
import Loading from "@/lib/Loading";
import Product from "./Product";

type Props = {
  list: string[];
  wishlist?: boolean;
};

const Products = ({ list, wishlist }: Props) => {
  const { data, isLoading, error } = useProductsFromIDs(list);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className=" flex flex-col ">
      {data.map((product) => {
        return (
          <Product key={product._id} product={product} wishlist={wishlist} />
        );
      })}
    </div>
  );
};

export default Products;
