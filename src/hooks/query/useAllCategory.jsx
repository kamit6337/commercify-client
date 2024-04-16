import { useQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";

const useAllCategory = (toggle = false) => {
  const query = useQuery({
    queryKey: ["All Categories"],
    queryFn: () => getReq("/category"),
    staleTime: Infinity,
    enabled: toggle,
  });

  return query;
};

export default useAllCategory;
