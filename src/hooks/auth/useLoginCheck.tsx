import { getAuthReq } from "@/utils/api/authApi";
import { useQuery } from "@tanstack/react-query";

const useLoginCheck = () => {
  const query = useQuery({
    queryKey: ["login check"],
    queryFn: () => getAuthReq("/login/check"),
    staleTime: Infinity,
  });

  return query;
};

export default useLoginCheck;
