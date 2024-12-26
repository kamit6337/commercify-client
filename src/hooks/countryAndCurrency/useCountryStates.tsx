import { getReq } from "@/utils/api/api";
import { useQuery } from "@tanstack/react-query";

const useCountryStates = (country: string) => {
  const query = useQuery({
    queryKey: ["country states", country],
    queryFn: () => getReq("/additional/states", { country }),
    staleTime: Infinity,
    enabled: !!country,
  });

  return query;
};

export default useCountryStates;
