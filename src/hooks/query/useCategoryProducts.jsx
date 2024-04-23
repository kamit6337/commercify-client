import { useQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";

const useCategoryProducts = (id) => {
  const query = useQuery({
    queryKey: ["Category Products", id],
    queryFn: () => getReq("/products", { categoryId: id }),
    staleTime: Infinity,
    enabled: !!id,
  });

  return query;
};

export default useCategoryProducts;
