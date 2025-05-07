import useAllProducts from "@/hooks/products/useAllProducts";
import ShowProducts from "@/components/admin/products/ShowProducts";

const AdminProducts = () => {
  const {
    isLoading,
    error,
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useAllProducts();

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

export default AdminProducts;
