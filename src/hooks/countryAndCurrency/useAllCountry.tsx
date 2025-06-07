import { initialCountryData } from "@/redux/slice/currencySlice";
import { COUNTRY } from "@/types";
import { getReq } from "@/utils/api/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useAllCountry = (toggle = false) => {
  const dispatch = useDispatch();
  const [isFindCountry, setIsFindCountry] = useState(true);

  const query = useQuery({
    queryKey: ["All Countries"],
    queryFn: () => getReq("/additional/countries"),
    staleTime: Infinity,
    enabled: toggle,
  });

  useEffect(() => {
    if (query.data) {
      const localCountryId = localStorage.getItem("country");

      if (!localCountryId) {
        setIsFindCountry(false);
        return;
      }

      const countries = query.data as COUNTRY[];

      const findCountry = countries.find(
        (country) => country._id.toString() === localCountryId
      ) as COUNTRY;

      if (!findCountry) {
        setIsFindCountry(false);
        return;
      }

      const obj = {
        id: findCountry._id,
        currency_code: findCountry.currency.code,
        currency_name: findCountry.currency.name,
        symbol: findCountry.currency.symbol,
        country: findCountry.name,
        flag: findCountry.flag,
        dial_code: findCountry.dial_code,
      };

      dispatch(initialCountryData(obj));
      setIsFindCountry(true);
    }
  }, [query.data]);

  return { ...query, isFindCountry };
};

export default useAllCountry;
