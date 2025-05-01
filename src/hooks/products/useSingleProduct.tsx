import { getReq } from "../../utils/api/api";
import { useQuery } from "@tanstack/react-query";

const useSingleProduct = (id: string) => {
  const query = useQuery({
    queryKey: ["Single Product", id],
    queryFn: () => getReq("/products", { id }),
    staleTime: Infinity,
    enabled: !!id,
  });

  return query;
};

export default useSingleProduct;
