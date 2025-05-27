import { getReq } from "@/utils/api/api";
import { useQuery } from "@tanstack/react-query";

type TimeScale = "day" | "month" | "year" | "6month";

const useAdminCountDetails = (
  toggle = false,
  timeScale: TimeScale = "month"
) => {
  const query = useQuery({
    queryKey: ["admin count details", timeScale],
    queryFn: () => getReq("/admin", { time: timeScale }),
    staleTime: Infinity,
    enabled: toggle,
  });

  return query;
};

export default useAdminCountDetails;
