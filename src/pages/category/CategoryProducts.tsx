import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import useCategoryProducts from "@/hooks/category/useCategoryProducts";
import Loading from "@/lib/Loading";
import { PARAMS, PRODUCT } from "@/types";
import ProductsAndFilter from "@/components/ProductsAndFilter";

const CategoryProducts = () => {
  const { id } = useParams() as PARAMS;
  const { isLoading, error, data, isFetching, fetchNextPage } =
    useCategoryProducts(id);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        {error.message}
      </div>
    );
  }

  const products = data?.pages.flat(1) as PRODUCT[];

  return (
    <>
      <Helmet>
        <title>Category</title>
        <meta name="description" content="Category products of this App" />
      </Helmet>

      <ProductsAndFilter
        products={products}
        isFetching={isFetching}
        fetchNextPage={fetchNextPage}
      />
    </>
  );
};

export default CategoryProducts;
