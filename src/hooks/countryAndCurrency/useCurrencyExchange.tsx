import { getReq } from "@/utils/api/api";
import { useQuery } from "@tanstack/react-query";

const useCurrencyExchange = () => {
  const query = useQuery({
    queryKey: ["currency exchange"],
    queryFn: () => getReq("/additional/currency"),
    staleTime: Infinity,
  });

  return query;
};

export default useCurrencyExchange;
