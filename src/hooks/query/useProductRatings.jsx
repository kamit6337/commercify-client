import { useQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";

const useProductRatings = (id) => {
  const query = useQuery({
    queryKey: ["Product Rating", id],
    queryFn: () => getReq("/ratings", { id }),
    enabled: !!id,
    staleTime: Infinity,
  });

  return query;
};

export default useProductRatings;
