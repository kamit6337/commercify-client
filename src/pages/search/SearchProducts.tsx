import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import useSearchProducts from "@/hooks/products/useSearchProducts";
import Loading from "@/lib/Loading";
import ProductsAndFilter from "@/components/ProductsAndFilter";

const SearchProducts = () => {
  const queryString = useSearchParams()[0].get("q") as string;
  const { data, isLoading, error } = useSearchProducts(queryString);

  if (isLoading) {
    return <Loading />;
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

      <ProductsAndFilter
        products={data}
        isPagination={false}
        fetchNextPage={() => null}
      />
    </>
  );
};

export default SearchProducts;
