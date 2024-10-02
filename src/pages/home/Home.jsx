import { Helmet } from "react-helmet";
import useAllProducts from "../../hooks/query/useAllProducts";
import Loading from "../../containers/Loading";
import MainProductsAndFilter from "../../components/MainProductsAndFilter";

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

      <MainProductsAndFilter
        products={data.pages.flat(Infinity)}
        isFetching={isFetching}
        fetchNextPage={fetchNextPage}
      />
    </>
  );
};

export default Home;
