import { useQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";

const useAllProducts = () => {
  const query = useQuery({
    queryKey: ["allProducts"],
    queryFn: () => getReq("/products"),
    staleTime: Infinity,
  });

  return query;
};

export default useAllProducts;
