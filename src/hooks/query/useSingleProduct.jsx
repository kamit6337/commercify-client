import { getReq } from "../../utils/api/api";
import { useQuery } from "@tanstack/react-query";

const useSingleProduct = (id) => {
  const query = useQuery({
    queryKey: ["Single Product", id],
    queryFn: () => getReq("/products", { id }),
    staleTime: Infinity,
  });

  return query;
};

export default useSingleProduct;
