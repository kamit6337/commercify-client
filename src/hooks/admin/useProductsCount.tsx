import { getReq } from "@/utils/api/api";
import { useQuery } from "@tanstack/react-query";

const useProductsCount = () => {
  const query = useQuery({
    queryKey: ["products count details"],
    queryFn: () => getReq("/admin/products"),
    staleTime: Infinity,
  });

  return query;
};

export default useProductsCount;
