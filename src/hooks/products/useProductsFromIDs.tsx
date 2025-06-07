import { useQueries } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";
import { useSelector } from "react-redux";
import { currencyState } from "@/redux/slice/currencySlice";

const useProductsFromIDs = (ids: string[]) => {
  const { currency_code } = useSelector(currencyState);

  const query = useQueries({
    queries: ids.map((id) => ({
      queryKey: ["Single Product", id],
      queryFn: () => getReq("/products/single", { id, currency_code }),
      staleTime: Infinity,
    })),
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        isLoading: results.some((result) => result.isLoading),
        error: results.some((result) => result.error?.message),
      };
    },
  });

  return query;
};

export default useProductsFromIDs;
