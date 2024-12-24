import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import environment from "../../utils/environment";
import Cookies from "js-cookie";
import { useEffect } from "react";

const URL = "https://www.universal-tutorial.com/api/getaccesstoken";

const useGetCountryKey = () => {
  const key = Cookies.get("_ut");

  const query = useQuery({
    queryKey: ["Country Info Key"],
    queryFn: async () => {
      const response = await axios.get(URL, {
        headers: {
          "user-email": environment.COUNTRY_KEY_EMAIL,
          "api-token": environment.COUNTRY_KEY,
          Accept: "application/json",
        },
      });
      return response?.data;
    },
    staleTime: Infinity,
    enabled: !key,
  });

  useEffect(() => {
    if (query.isSuccess) {
      const token = query.data.auth_token;

      Cookies.set("_ut", token, {
        expires: 1,
      });
    }
  }, [query]);

  return query;
};

export default useGetCountryKey;
