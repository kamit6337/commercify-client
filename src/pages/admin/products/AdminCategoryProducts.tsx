import useCategoryProducts from "@/hooks/category/useCategoryProducts";
import { PARAMS } from "@/types";
import { useParams } from "react-router-dom";
import ShowProducts from "@/components/admin/products/ShowProducts";

const AdminCategoryProducts = () => {
  const { id } = useParams() as PARAMS;

  const {
    isLoading,
    error,
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useCategoryProducts(id);

  return (
    <ShowProducts
      isLoading={isLoading}
      error={error}
      data={data}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
    />
  );
};

export default AdminCategoryProducts;
