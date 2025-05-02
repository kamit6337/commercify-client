import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useUserOrders from "@/hooks/buys/useUserOrders";
import Loading from "@/lib/Loading";
import { BUY } from "@/types";
import useUserBuysCount from "@/hooks/buys/useUserBuysCount";
import SingleBuy from "./SingleBuy";

const UserOrders = () => {
  const [page, setPage] = useState(1);
  const { isLoading, error, data, fetchNextPage, isFetchingNextPage } =
    useUserOrders();

  const {
    isLoading: isLoadingBuysCount,
    error: errorBuysCount,
    data: buysCount,
  } = useUserBuysCount();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  if (isLoading || isLoadingBuysCount) {
    return <Loading />;
  }

  if (error || errorBuysCount) {
    return <div>{error?.message || errorBuysCount?.message}</div>;
  }

  const buys = data?.pages.at(page - 1) as BUY[];

  const handlePrevFetch = () => {
    setPage((prev) => prev - 1);
  };

  const handleNextFetch = () => {
    if (isFetchingNextPage) return;
    fetchNextPage().then(() => {
      setPage((prev) => prev + 1);
    });
  };

  if (page === 1 && buys.length === 0) {
    return (
      <div
        className="w-full flex flex-col gap-3 items-center justify-center bg-white"
        style={{ height: "calc(100vh - 120px)" }}
      >
        <p>No orders yet.</p>
        <Link to={`/`}>
          <p className="bg-orange-600 py-2 px-10 rounded text-white">
            Start Shopping
          </p>
        </Link>
      </div>
    );
  }

  // if (page > 1 && !data?.length) {
  //   return (
  //     <div
  //       className="w-full flex flex-col gap-3 items-center justify-center bg-white"
  //       style={{ height: "calc(100vh - 120px)" }}
  //     >
  //       <p>No further orders yet.</p>
  //     </div>
  //   );
  // }

  return (
    <>
      <section className="bg-white">
        <p className="border-b-2 py-4 px-10">Orders ({buysCount})</p>
        <main>
          {isFetchingNextPage && <Loading />}
          {buys?.length > 0 ? (
            buys.map((buy) => {
              return <SingleBuy key={buy._id} buy={buy} />;
            })
          ) : (
            <div className="w-full h-96 flex justify-center items-center">
              No Further orders
            </div>
          )}
        </main>
      </section>
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
            disabled={isFetchingNextPage}
            onClick={handleNextFetch}
            className={isFetchingNextPage ? "" : "hover:text-blue-500"}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default UserOrders;
