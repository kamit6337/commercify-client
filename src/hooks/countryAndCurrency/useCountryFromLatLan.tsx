import { getReq } from "@/utils/api/api";
import { useQuery } from "@tanstack/react-query";

const useCountryFromLatLan = (lat: number, lon: number) => {
  const query = useQuery({
    queryKey: ["location", lat, lon],
    queryFn: () => getReq("/additional/countries", { lat, lon }),
    staleTime: Infinity,
    enabled: !!lat && !!lon,
  });

  return query;
};

export default useCountryFromLatLan;
