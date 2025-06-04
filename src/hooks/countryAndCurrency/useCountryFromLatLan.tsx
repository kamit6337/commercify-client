import { getReq } from "@/utils/api/api";
import { useQuery } from "@tanstack/react-query";

const useCountryFromLatLan = (toggle = false, lat: number, lon: number) => {
  const query = useQuery({
    queryKey: ["location", lat, lon],
    queryFn: () => getReq("/additional/country", { lat, lon }),
    staleTime: Infinity,
    enabled: toggle && !!lat && !!lon,
  });

  return query;
};

export default useCountryFromLatLan;
