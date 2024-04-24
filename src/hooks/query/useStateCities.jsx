import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";

const URL = "https://www.universal-tutorial.com/api/cities/";

const useStateCities = (state) => {
  const key = Cookies.get("_ut");

  const query = useQuery({
    queryKey: ["State Cities", state],
    queryFn: async () => {
      const addstateToUrl = URL + state;

      const response = await axios.get(addstateToUrl, {
        headers: {
          Authorization: `Bearer ${key}`,
        },
      });
      return response?.data;
    },
    enabled: !!state && !!key,
    staleTime: Infinity,
  });

  return query;
};

export default useStateCities;
