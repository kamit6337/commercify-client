import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";

const URL = "https://www.universal-tutorial.com/api/states/";

const useCountryStates = (country) => {
  const key = Cookies.get("_ut");

  const query = useQuery({
    queryKey: ["Country States", country],
    queryFn: async () => {
      const addCountryToUrl = URL + country;

      const response = await axios.get(addCountryToUrl, {
        headers: {
          Authorization: `Bearer ${key}`,
        },
      });
      return response?.data;
    },
    enabled: !!country && !!key,
    staleTime: Infinity,
  });

  return query;
};

export default useCountryStates;
