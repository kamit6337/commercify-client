import { useQueries } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";

const useProductsFromIDs = (list) => {
  const queries = useQueries({
    queries: list.map((id) => ({
      queryKey: ["Single Product", id],
      queryFn: () => getReq("/products", { id }),
      staleTime: Infinity,
    })),
    combine: (results) => {
      return {
        data: results.map((result) => result.data?.data),
        isLoading: results.some((result) => result.isLoading),
        error: results.some((result) => result.error),
      };
    },
  });

  return queries;
};

export default useProductsFromIDs;
