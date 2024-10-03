import { useQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";

const useLoginCheck = (toggle = true) => {
  const query = useQuery({
    queryKey: ["checkAuth"],
    queryFn: () => getReq("/auth/login/check"),
    staleTime: Infinity,
    enabled: toggle,
  });

  return query;
};

export default useLoginCheck;
