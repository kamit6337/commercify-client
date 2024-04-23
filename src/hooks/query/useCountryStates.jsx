import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import environment from "../../utils/environment";

const URL = "https://www.universal-tutorial.com/api/states/";

const useCountryStates = (country) => {
  const query = useQuery({
    queryKey: ["Country States", country],
    queryFn: async () => {
      const addCountryToUrl = URL + country;

      const response = await axios.get(addCountryToUrl, {
        headers: {
          Authorization: `Bearer ${environment.COUNTRY_KEY}`,
        },
      });
      return response?.data;
    },
    enabled: !!country,
    staleTime: Infinity,
  });

  return query;
};

export default useCountryStates;
