import { useQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";

const useLoginCheck = () => {
  const query = useQuery({
    queryKey: ["checkAuth"],
    queryFn: () => getReq("/auth/login/check"),
    staleTime: Infinity,
  });

  return query;
};

export default useLoginCheck;
