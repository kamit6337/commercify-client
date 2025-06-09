import { useInfiniteQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";
import { useSelector } from "react-redux";
import { currencyState } from "@/redux/slice/currencySlice";

const useCategoryProducts = (id: string) => {
  const { id: countryId } = useSelector(currencyState);

  const query = useInfiniteQuery({
    queryKey: ["Category Products", id],
    queryFn: ({ pageParam }) =>
      getReq("/products/category", {
        page: pageParam,
        categoryId: id,
        countryId,
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
