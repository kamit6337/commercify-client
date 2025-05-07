import { getReq } from "@/utils/api/api";
import { useQuery } from "@tanstack/react-query";

const useProductsCount = (toggle = false) => {
  const query = useQuery({
    queryKey: ["products count details"],
    queryFn: () => getReq("/admin/products"),
    staleTime: Infinity,
    enabled: toggle,
  });

  return query;
};

export default useProductsCount;
