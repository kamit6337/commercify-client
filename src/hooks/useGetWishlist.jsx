import { useQuery } from "@tanstack/react-query";
import { getReq } from "../utils/api/api";

const useGetWishlist = () => {
  return useQuery({
    queryKey: ["getCart"],
    queryFn: () => getReq("/wishlist"),
    staleTime: Infinity,
    cacheTime: Infinity,
  });
};

export default useGetWishlist;
