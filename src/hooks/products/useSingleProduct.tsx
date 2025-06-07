import { useSelector } from "react-redux";
import { getReq } from "../../utils/api/api";
import { useQuery } from "@tanstack/react-query";
import { currencyState } from "@/redux/slice/currencySlice";

const useSingleProduct = (id: string) => {
  const { currency_code } = useSelector(currencyState);

  const query = useQuery({
    queryKey: ["Single Product", id],
    queryFn: () => getReq("/products/single", { id, currency_code }),
    staleTime: Infinity,
    enabled: !!id,
  });

  return query;
};

export default useSingleProduct;
