import { getReq } from "@/utils/api/api";
import { useQuery } from "@tanstack/react-query";

const useAdminCountDetails = () => {
  const query = useQuery({
    queryKey: ["admin count details"],
    queryFn: () => getReq("/admin"),
    staleTime: Infinity,
  });

  return query;
};

export default useAdminCountDetails;
