import { TimeScale } from "@/types";
import { getReq } from "@/utils/api/api";
import { useQuery } from "@tanstack/react-query";

const useOrdersCount = (timeScale: TimeScale) => {
  const query = useQuery({
    queryKey: ["orders count", timeScale],
    queryFn: () => getReq("/admin/orders", { time: timeScale }),
    staleTime: Infinity,
  });

  return query;
};

export default useOrdersCount;
