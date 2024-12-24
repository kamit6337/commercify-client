import ProductsAndFilter from "@/components/ProductsAndFilter";
import useAllProducts from "@/hooks/products/useAllProducts";
import Loading from "@/lib/Loading";
import { Helmet } from "react-helmet";

const Home = () => {
  const { data, isLoading, error, isFetching, fetchNextPage } =
    useAllProducts();

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

  return (
    <>
      <Helmet>
        <title>Commercify</title>
        <meta name="description" content="An e-Commerce App" />
      </Helmet>

      <ProductsAndFilter
        products={data?.pages.flat(1)}
        isFetching={isFetching}
        fetchNextPage={fetchNextPage}
      />
    </>
  );
};

export default Home;
