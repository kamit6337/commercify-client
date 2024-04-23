import { useQuery } from "@tanstack/react-query";
import { getReq } from "../utils/api/api";

const useGetCartQuery = () => {
  return useQuery({
    queryKey: ["getWishlist"],
    queryFn: () => getReq("/cart"),
    staleTime: Infinity,
    cacheTime: Infinity,
  });
};

export default useGetCartQuery;
