import { useQueries } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";
import { useDispatch, useSelector } from "react-redux";
import { currencyState } from "@/redux/slice/currencySlice";
import { useEffect } from "react";
import { addSaleAndStock } from "@/redux/slice/saleAndStockSlice";

const useProductsFromIDs = (ids: string[]) => {
  const dispatch = useDispatch();
  const { id: countryId } = useSelector(currencyState);

  const query = useQueries({
    queries: ids.map((id) => ({
      queryKey: ["Single Product", id],
      queryFn: () => getReq("/products/single", { id, countryId }),
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

  useEffect(() => {
    if (query.data) {
      const products = query.data;

      if (products.length === 0) return;

      dispatch(addSaleAndStock(products));
    }
  }, [query.data]);

  return query;
};

export default useProductsFromIDs;
