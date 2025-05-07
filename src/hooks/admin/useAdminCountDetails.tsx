import { getReq } from "@/utils/api/api";
import { useQuery } from "@tanstack/react-query";

const useAdminCountDetails = (toggle = false) => {
  const query = useQuery({
    queryKey: ["admin count details"],
    queryFn: () => getReq("/admin"),
    staleTime: Infinity,
    enabled: toggle,
  });

  return query;
};

export default useAdminCountDetails;
