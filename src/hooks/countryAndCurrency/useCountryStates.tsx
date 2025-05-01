import { getReq } from "@/utils/api/api";
import { useQuery } from "@tanstack/react-query";

const useCountryStates = (
  country: string | undefined,
  code: string | undefined
) => {
  const query = useQuery({
    queryKey: ["country states", country],
    queryFn: () => getReq("/additional/states", { country, code }),
    staleTime: Infinity,
    enabled: !!country && !!code,
  });

  return query;
};

export default useCountryStates;
