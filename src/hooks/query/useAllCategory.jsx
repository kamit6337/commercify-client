import { useQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";

const useAllCategory = () => {
  const query = useQuery({
    queryKey: ["All Categories"],
    queryFn: () => getReq("/category"),
    staleTime: Infinity,
  });

  return query;
};

export default useAllCategory;
