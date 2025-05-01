import ProductsAndFilter from "@/components/ProductsAndFilter";
import useAllProducts from "@/hooks/products/useAllProducts";
import Loading from "@/lib/Loading";
import { PRODUCT } from "@/types";
import { Helmet } from "react-helmet";

const Home = () => {
  const {
    data,
    isLoading,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useAllProducts();

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const products = data?.pages.flatMap((page) => page) as PRODUCT[];

  return (
    <>
      <Helmet>
        <title>Commercify</title>
        <meta name="description" content="An e-Commerce App" />
      </Helmet>

      <ProductsAndFilter
        products={products}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isPagination={true}
      />
    </>
  );
};

export default Home;
