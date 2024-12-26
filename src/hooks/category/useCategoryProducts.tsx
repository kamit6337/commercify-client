import { useInfiniteQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";

const useCategoryProducts = (id: string) => {
  const query = useInfiniteQuery({
    queryKey: ["Category Products", id],
    queryFn: ({ pageParam }) =>
      getReq("/products", { page: pageParam, categoryId: id }),
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

export default useCategoryProducts;
