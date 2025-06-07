import { useQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";

const useBuyProducts = (id: string) => {
  const query = useQuery({
    queryKey: ["Buy Products", id],
    queryFn: () =>
      getReq("/payment/success", {
        orderId: id,
      }),
    staleTime: Infinity,
    enabled: !!id,
  });

  return query;
};

export default useBuyProducts;
