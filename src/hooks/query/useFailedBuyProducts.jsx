import { useQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";

const useFailedBuyProducts = () => {
  const query = useQuery({
    queryKey: ["Failed Buy Products"],
    queryFn: () => getReq("/payment/failed"),
    staleTime: Infinity,
  });

  return query;
};

export default useFailedBuyProducts;
