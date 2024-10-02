import { useInfiniteQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";

const useProductRatings = (id) => {
  const query = useInfiniteQuery({
    queryKey: ["Product Rating", id],
    queryFn: ({ pageParam }) => getReq("/ratings", { page: pageParam, id }),
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

export default useProductRatings;
