import { useQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";

const useLoginCheck = () => {
  const query = useQuery({
    queryKey: ["checkAuth"],
    queryFn: () => getReq("/auth/login/check"),
    // staleTime: Infinity, // Set staleTime to Infinity to disable automatic refetching
    // refetchInterval: 15 * 60 * 60, //15 minutes
    // retry: 2,
  });

  return query;
};

export default useLoginCheck;
