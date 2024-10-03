import { useQueries } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";

const useProductsFromIDs = (ids) => {
  const query = useQueries({
    queries: ids.map((id) => ({
      queryKey: ["Single Product", id],
      queryFn: () => getReq("/products", { id }),
      staleTime: Infinity,
    })),
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        isLoading: results.some((result) => result.isLoading),
        error: results.some((result) => result.error),
      };
    },
  });

  return query;
};

export default useProductsFromIDs;
