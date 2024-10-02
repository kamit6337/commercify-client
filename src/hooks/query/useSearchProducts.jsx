import { useQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";

const useSearchProducts = (queryStr) => {
  const query = useQuery({
    queryKey: ["search products", queryStr],
    queryFn: () => getReq("/search", { q: queryStr }),
    staleTime: Infinity,
  });

  return query;
};

export default useSearchProducts;
