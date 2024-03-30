import { useQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";

const useUserOrders = () => {
  const query = useQuery({
    queryKey: ["buy products of user"],
    queryFn: () => getReq("/buy"),
    staleTime: Infinity,
  });

  return query;
};

export default useUserOrders;
