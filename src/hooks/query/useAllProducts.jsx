import { useInfiniteQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";

const useAllProducts = () => {
  const query = useInfiniteQuery({
    queryKey: ["allProducts"],
    queryFn: ({ pageParam }) => getReq("/products", { page: pageParam }),
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

export default useAllProducts;
