import { useDispatch, useSelector } from "react-redux";
import { getReq } from "../../utils/api/api";
import { useQuery } from "@tanstack/react-query";
import { currencyState } from "@/redux/slice/currencySlice";
import { useEffect } from "react";
import { addSaleAndStock } from "@/redux/slice/saleAndStockSlice";

const useSingleProduct = (id: string) => {
  const dispatch = useDispatch();
  const { id: countryId } = useSelector(currencyState);

  const query = useQuery({
    queryKey: ["Single Product", id],
    queryFn: () => getReq("/products/single", { id, countryId }),
    staleTime: Infinity,
    enabled: !!id,
  });

  useEffect(() => {
    if (query.data) {
      const product = query.data;
      dispatch(addSaleAndStock([product]));
    }
  }, [query.data]);

  return query;
};

export default useSingleProduct;
