import { useQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";

const useUserOrders = (toggle = false) => {
  const query = useQuery({
    queryKey: ["buy products of user"],
    queryFn: () => getReq("/buy"),
    staleTime: Infinity,
    enabled: toggle,
  });

  return query;
};

export default useUserOrders;
