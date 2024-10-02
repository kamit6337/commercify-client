import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import useSearchProducts from "../../hooks/query/useSearchProducts";
import Loading from "../../containers/Loading";
import MainProductsAndFilter from "../../components/MainProductsAndFilter";

const SearchProducts = () => {
  const queryString = useSearchParams()[0].get("q");
  const { data, isLoading, error } = useSearchProducts(queryString);

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
        <title>Search-{queryString}</title>
        <meta name="description" content="An e-Commerce App" />
      </Helmet>

      <MainProductsAndFilter products={data} isPagination={false} />
    </>
  );
};

export default SearchProducts;
