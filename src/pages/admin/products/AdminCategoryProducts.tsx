import useCategoryProducts from "@/hooks/category/useCategoryProducts";
import Loading from "@/lib/Loading";
import { PARAMS, PRODUCT } from "@/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminSingleProduct from "./AdminSingleProduct";

const AdminCategoryProducts = () => {
  const { id } = useParams() as PARAMS;

  const [page, setPage] = useState(1);

  const {
    isLoading,
    error,
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useCategoryProducts(id);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error?.message}</p>;
  }

  const products = data?.pages[page - 1] as PRODUCT[];

  if (page === 1 && products?.length === 0) {
    return (
      <p className="h-96 flex justify-center items-center bg-white">
        No Products available
      </p>
    );
  }

  const handlePrevFetch = () => {
    setPage((prev) => prev - 1);
  };

  const handleNextFetch = () => {
    if (isFetchingNextPage) return;
    fetchNextPage().then(() => {
      setPage((prev) => prev + 1);
    });
  };

  return (
    <div className="space-y-5">
      <div className="bg-white">
        {products.length > 0 ? (
          products.map((product) => {
            return <AdminSingleProduct product={product} key={product._id} />;
          })
        ) : (
          <div className="w-full h-96 flex justify-center items-center">
            No Further orders
          </div>
        )}
      </div>
      <div className="mt-10 h-20  text-center flex justify-center items-center">
        <div className="w-max bg-white h-full flex justify-center items-center gap-10 px-10">
          <button
            disabled={page === 1}
            onClick={handlePrevFetch}
            className={page === 1 ? "" : "hover:text-blue-500"}
          >
            Prev
          </button>
          <button
            disabled={isFetchingNextPage || !hasNextPage}
            onClick={handleNextFetch}
            className={!hasNextPage ? "" : "hover:text-blue-500"}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCategoryProducts;
