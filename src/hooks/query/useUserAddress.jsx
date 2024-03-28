import { useQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";

const useUserAddress = (toggle = false) => {
  const query = useQuery({
    queryKey: ["address"],
    queryFn: () => getReq("/address"),
    staleTime: Infinity,
    enabled: toggle,
  });

  return query;
};

export default useUserAddress;
