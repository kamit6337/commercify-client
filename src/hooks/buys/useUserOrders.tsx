import { useInfiniteQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";
import { useLocation } from "react-router-dom";

const useUserOrders = () => {
  const location = useLocation();
  const isUserOrdersPage = location.pathname === "/user/orders"; // ✅ condition

  const query = useInfiniteQuery({
    queryKey: ["buy products of user"],
    queryFn: ({ pageParam }) => getReq("/buy", { page: pageParam }),
    enabled: isUserOrdersPage, // ✅ Only fetch if on user-orders route
    staleTime: Infinity, // ✅ Stay fresh forever unless manually invalidated
    refetchOnWindowFocus: false, // ✅ Avoid refetching on tab switch
    refetchOnMount: true, // ✅ Force refetch if re-mounted
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
