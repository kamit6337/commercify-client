import { getReq } from "@/utils/api/api";
import { useQuery } from "@tanstack/react-query";

const useStateCities = (state: string) => {
  const query = useQuery({
    queryKey: ["state cities", state],
    queryFn: () => getReq("/additional/states", { state }),
    staleTime: Infinity,
    enabled: !!state,
  });

  return query;
};

export default useStateCities;
