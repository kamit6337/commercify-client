import { getReq } from "@/utils/api/api";
import { useQuery } from "@tanstack/react-query";

const useCurrencyExchange = (toggle = false) => {
  const query = useQuery({
    queryKey: ["currency exchange"],
    queryFn: () => getReq("/additional/currency"),
    staleTime: Infinity,
    enabled: toggle,
  });

  return query;
};

export default useCurrencyExchange;
