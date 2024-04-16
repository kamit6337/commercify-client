import { useQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";

const useAllProducts = (toggle = false) => {
  const query = useQuery({
    queryKey: ["allProducts"],
    queryFn: () => getReq("/products"),
    staleTime: Infinity,
    enabled: toggle,
  });

  return query;
};

export default useAllProducts;
