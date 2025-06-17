import { getReq } from "@/utils/api/api";
import { useQuery } from "@tanstack/react-query";

const usePingServer = () => {
  const query = useQuery({
    queryKey: ["ping server"],
    queryFn: () => getReq("/health"),
    refetchInterval: 50 * 1000, // 50 seconds
    refetchIntervalInBackground: true,
  });

  return query;
};

export default usePingServer;
