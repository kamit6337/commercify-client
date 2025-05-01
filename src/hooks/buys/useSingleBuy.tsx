import { getReq } from "@/utils/api/api";
import { useQuery } from "@tanstack/react-query";

const useSingleBuy = (buyId: string) => {
  const query = useQuery({
    queryKey: ["single buy", buyId],
    queryFn: () => getReq("/buy", { id: buyId }),
    staleTime: Infinity,
    enabled: false,
  });

  return query;
};

export default useSingleBuy;
