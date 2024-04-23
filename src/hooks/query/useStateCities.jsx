import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import environment from "../../utils/environment";

const URL = "https://www.universal-tutorial.com/api/cities/";

const useStateCities = (state) => {
  const query = useQuery({
    queryKey: ["State Cities", state],
    queryFn: async () => {
      const addstateToUrl = URL + state;

      const response = await axios.get(addstateToUrl, {
        headers: {
          Authorization: `Bearer ${environment.COUNTRY_KEY}`,
        },
      });
      return response?.data;
    },
    enabled: !!state,
    staleTime: Infinity,
  });

  return query;
};

export default useStateCities;
