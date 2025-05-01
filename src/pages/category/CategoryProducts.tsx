import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import useCategoryProducts from "@/hooks/category/useCategoryProducts";
import Loading from "@/lib/Loading";
import { PARAMS, PRODUCT } from "@/types";
import ProductsAndFilter from "@/components/ProductsAndFilter";
import useAllCategory from "@/hooks/category/useAllCategory";

const CategoryProducts = () => {
  const { id } = useParams() as PARAMS;
  const {
    isLoading,
    error,
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useCategoryProducts(id);

  const { data: allCategory } = useAllCategory();

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

  const products = data?.pages.flatMap((page) => page) as PRODUCT[];

  const activeCategory = allCategory?.find((category) => category._id === id);

  return (
    <>
      <Helmet>
        <title>Category | {activeCategory}</title>
        <meta name="description" content="Category products of this App" />
      </Helmet>

      <ProductsAndFilter
        id={id}
        products={products}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isPagination={true}
      />
    </>
  );
};

export default CategoryProducts;
