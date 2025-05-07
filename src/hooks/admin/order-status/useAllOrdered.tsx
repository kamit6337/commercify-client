import { getReq } from "@/utils/api/api";
import { useInfiniteQuery } from "@tanstack/react-query";

const useAllOrdered = () => {
  const query = useInfiniteQuery({
    queryKey: ["all ordered"],
    queryFn: () => getReq("/admin/order-status/ordered"),
    staleTime: Infinity,
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (!lastPage || lastPage.length === 0) return undefined;
      return lastPageParam + 1;
    },
  });

  return query;
};

export default useAllOrdered;
