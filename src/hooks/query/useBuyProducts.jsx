import { useQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";

const useBuyProducts = (token) => {
  const query = useQuery({
    queryKey: ["buy Products"],
    queryFn: () => getReq("/payment/success", { token }),
    staleTime: Infinity,
    enabled: !!token,
  });

  return query;
};

export default useBuyProducts;
