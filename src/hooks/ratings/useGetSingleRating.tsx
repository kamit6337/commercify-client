import { getReq } from "@/utils/api/api";
import { useQuery } from "@tanstack/react-query";

const useGetSingleRating = (ratingId: string) => {
  const query = useQuery({
    queryKey: ["single rating", ratingId],
    queryFn: () => getReq("/ratings/single", { id: ratingId }),
    staleTime: Infinity,
    enabled: false,
  });

  return query;
};

export default useGetSingleRating;
