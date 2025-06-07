import useProductsFromIDs from "@/hooks/products/useProductsFromIDs";
import Loading from "@/lib/Loading";
import Product from "./Product";
import { PRODUCT } from "@/types";

type Product = {
  id: string;
  quantity: number;
};

type Props = {
  list: Product[];
};

const Products = ({ list }: Props) => {
  const { data, isLoading, error } = useProductsFromIDs(
    list.map((obj) => obj.id)
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const products = data as PRODUCT[];

  console.log("products", products);

  return (
    <div className="flex flex-col border">
      {products.map((product, i) => {
        return <Product key={i} product={product} />;
      })}
    </div>
  );
};

export default Products;
