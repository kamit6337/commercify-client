import { currencyState } from "@/redux/slice/currencySlice";
import { addSaleAndStock } from "@/redux/slice/saleAndStockSlice";
import { getReq } from "@/utils/api/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useSearchProducts = (text: string) => {
  const dispatch = useDispatch();
  const { id } = useSelector(currencyState);

  const query = useQuery({
    queryKey: ["search products", text],
    queryFn: () => getReq("/search", { q: text, countryId: id }),
    staleTime: Infinity,
    enabled: false,
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

export default useSearchProducts;
