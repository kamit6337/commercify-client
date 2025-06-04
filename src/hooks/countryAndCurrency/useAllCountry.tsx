import { getReq } from "@/utils/api/api";
import { useQuery } from "@tanstack/react-query";

const useAllCountry = () => {
  const query = useQuery({
    queryKey: ["All Countries"],
    queryFn: () => getReq("/additional/countries"),
    staleTime: Infinity,
  });
  return query;
};

export default useAllCountry;
