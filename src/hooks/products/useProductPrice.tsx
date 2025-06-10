import { getReq } from "@/utils/api/api";
import { useQuery } from "@tanstack/react-query";

const useProductPrice = (productId: string, countryId: string) => {
  const query = useQuery({
    queryKey: ["product price", productId, countryId],
    queryFn: () => getReq("/products/price", { productId, countryId }),
    staleTime: Infinity,
    enabled: !!productId && !!countryId,
  });

  return query;
};

export default useProductPrice;
