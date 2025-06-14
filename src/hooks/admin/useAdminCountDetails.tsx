import { TimeScale } from "@/types";
import { getReq } from "@/utils/api/api";
import { useQuery } from "@tanstack/react-query";

const useAdminCountDetails = (timeScale: TimeScale) => {
  const query = useQuery({
    queryKey: ["admin count details", timeScale],
    queryFn: () => getReq("/admin", { time: timeScale }),
    staleTime: Infinity,
  });

  return query;
};

export default useAdminCountDetails;
