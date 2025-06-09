import { useInfiniteQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";
import { useDispatch, useSelector } from "react-redux";
import { currencyState } from "@/redux/slice/currencySlice";
import { useEffect } from "react";
import { addSaleAndStock } from "@/redux/slice/saleAndStockSlice";

const useAllProducts = () => {
  const dispatch = useDispatch();
  const { id } = useSelector(currencyState);

  const query = useInfiniteQuery({
    queryKey: ["allProducts"],
    queryFn: ({ pageParam }) =>
      getReq("/products", { page: pageParam, countryId: id }),
    staleTime: Infinity,
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      } else {
        return lastPageParam + 1;
      }
    },
  });

  useEffect(() => {
    if (query.data) {
      const products = query.data.pages.flatMap((page) => page);

      if (products.length === 0) return;

      dispatch(addSaleAndStock(products));
    }
  }, [query.data]);

  return query;
};

export default useAllProducts;
