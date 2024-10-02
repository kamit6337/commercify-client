import { useQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";

const useProductsFromIDs = (ids) => {
  const query = useQuery({
    queryKey: ["list products"],
    queryFn: () => getReq("/products/list", { ids }),
    staleTime: Infinity,
  });

  return query;
};

export default useProductsFromIDs;
