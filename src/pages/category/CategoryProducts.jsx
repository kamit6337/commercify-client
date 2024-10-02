import { useParams } from "react-router-dom";
import Loading from "../../containers/Loading";
import useCategoryProducts from "../../hooks/query/useCategoryProducts";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import MainProductsAndFilter from "../../components/MainProductsAndFilter";

const CategoryProducts = () => {
  const { id } = useParams();
  const { isLoading, error, data, isFetching, fetchNextPage } =
    useCategoryProducts(id);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [id]);

  if (isLoading) {
    return (
      <div className="w-full h-96">
        <Loading />
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        {error.message}
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Category</title>
        <meta name="description" content="Category products of this App" />
      </Helmet>

      <MainProductsAndFilter
        products={data.pages.flat(Infinity)}
        isFetching={isFetching}
        fetchNextPage={fetchNextPage}
      />
    </>
  );
};

export default CategoryProducts;
