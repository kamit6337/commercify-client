import { getAuthReq } from "@/utils/api/authApi";
import { useQuery } from "@tanstack/react-query";

const useLoginAdminCheck = (toggle = true) => {
  const query = useQuery({
    queryKey: ["login admin check"],
    queryFn: () => getAuthReq("/login/admin/check"),
    staleTime: Infinity,
    enabled: toggle,
  });

  return query;
};

export default useLoginAdminCheck;
