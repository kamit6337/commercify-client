import { getAuthReq } from "@/utils/api/authApi";
import { useQuery } from "@tanstack/react-query";

const useLoginCheck = (toggle = true) => {
  const query = useQuery({
    queryKey: ["login check"],
    queryFn: () => getAuthReq("/login/check"),
    staleTime: Infinity,
    enabled: toggle,
  });

  return query;
};

export default useLoginCheck;
