import Loading from "@/lib/Loading";
import SingleBuy from "@/pages/admin/orderStatus/SingleBuy";
import { BUY } from "@/types";
import { getReq } from "@/utils/api/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type Props = {
  querykey: string;
  path: "ordered" | "undelivered" | "delivered" | "cancelled" | "returned";
};

const AllOrderStatus = ({ querykey, path }: Props) => {
  const [page, setPage] = useState(1);

  const {
    isLoading,
    error,
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: [querykey],
    queryFn: ({ pageParam }) =>
      getReq(`/admin/order-status/${path}`, { page: pageParam }),
    staleTime: Infinity,
    enabled: !!querykey && !!path,
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (!lastPage || lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [page]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  const buys = data?.pages[page - 1] as BUY[];

  if (page === 1 && buys.length === 0) {
    return (
      <p className="h-96 flex justify-center items-center bg-white">
        No order present
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

  const lastPageBool = !hasNextPage && page === data?.pageParams.at(-1);

  return (
    <div className="space-y-5">
      <div className="bg-white w-full p-3 text-lg">Orders ({buys.length})</div>
      <div className="bg-white">
        {buys.length > 0 ? (
          buys.map((buy: BUY) => {
            return <SingleBuy buy={buy} key={buy._id} />;
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
            disabled={lastPageBool}
            onClick={handleNextFetch}
            className={lastPageBool ? "" : "hover:text-blue-500"}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllOrderStatus;
