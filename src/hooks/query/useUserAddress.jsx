import { useQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";

const useUserAddress = () => {
  const query = useQuery({
    queryKey: ["address"],
    queryFn: () => getReq("/address"),
    staleTime: Infinity,
  });

  return query;
};

export default useUserAddress;
