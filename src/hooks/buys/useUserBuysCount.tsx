import { useQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";

const useUserBuysCount = () => {
  const query = useQuery({
    queryKey: ["buys count"],
    queryFn: () => getReq("/buy/counts"),
    staleTime: Infinity,
  });

  return query;
};

export default useUserBuysCount;
