import { useInfiniteQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";

const useUserOrders = () => {
  const query = useInfiniteQuery({
    queryKey: ["buy products of user"],
    queryFn: ({ pageParam }) => getReq("/buy", { page: pageParam }),
    staleTime: Infinity,
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      } else {
        return lastPageParam + 1;
      }
    },
  });

  return query;
};

export default useUserOrders;
