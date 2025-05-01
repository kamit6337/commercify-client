import { getReq } from "@/utils/api/api";
import { useQuery } from "@tanstack/react-query";

const useStateCities = (
  countrycode: string | undefined,
  state: string | undefined,
  code: string
) => {
  const query = useQuery({
    queryKey: ["state cities", state],
    queryFn: () => getReq("/additional/cities", { countrycode, state, code }),
    staleTime: Infinity,
    enabled: !!countrycode && !!state && !!code,
  });

  return query;
};

export default useStateCities;
