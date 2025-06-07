import { useInfiniteQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";
import { useSelector } from "react-redux";
import { currencyState } from "@/redux/slice/currencySlice";

const useCategoryProducts = (id: string) => {
  const { currency_code } = useSelector(currencyState);

  const query = useInfiniteQuery({
    queryKey: ["Category Products", id],
    queryFn: ({ pageParam }) =>
      getReq("/products/category", {
        page: pageParam,
        categoryId: id,
        currency_code,
      }),
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

  return query;
};

export default useCategoryProducts;
