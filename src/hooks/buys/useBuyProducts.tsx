import { useQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";

const useBuyProducts = (id: string) => {
  const query = useQuery({
    queryKey: ["Buy Products"],
    queryFn: () =>
      getReq("/payment/success", {
        cartSessionId: id,
      }),
    staleTime: Infinity,
    enabled: !!id,
  });

  return query;
};

export default useBuyProducts;
