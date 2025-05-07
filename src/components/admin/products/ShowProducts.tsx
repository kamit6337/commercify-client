import Loading from "@/lib/Loading";
import AdminSingleProduct from "@/pages/admin/products/AdminSingleProduct";
import { PRODUCT } from "@/types";
import { useEffect, useState } from "react";

type DATA = {
  pages: PRODUCT[][];
  pageParams: unknown[];
};

type Props = {
  isLoading: boolean;
  error: Error | null;
  data?: DATA;
  isFetchingNextPage: boolean;
  fetchNextPage: () => Promise<unknown>;
  hasNextPage?: boolean;
};

const ShowProducts = ({
  isLoading,
  error,
  data,
  isFetchingNextPage,
  fetchNextPage,
  hasNextPage,
}: Props) => {
  const [page, setPage] = useState(1);

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
    return <p>No Products available</p>;
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

  const isDisabled =
    !hasNextPage && page === (data?.pageParams.at(-1) as number | undefined);

  return (
    <div className="space-y-5">
      <div className="bg-white w-full p-3 text-lg">
        Products ({products.length})
      </div>
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
            disabled={isDisabled}
            onClick={handleNextFetch}
            className={isDisabled ? "" : "hover:text-blue-500"}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowProducts;
