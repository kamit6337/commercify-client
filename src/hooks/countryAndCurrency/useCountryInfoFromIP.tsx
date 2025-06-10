import { useEffect, useState } from "react";
import useAllCountry from "./useAllCountry";
import { COUNTRY } from "@/types";
import { useDispatch } from "react-redux";
import { initialCountryData } from "@/redux/slice/currencySlice";

export async function getCountryInfoOnce(
  countries: COUNTRY[]
): Promise<COUNTRY | null> {
  const cached = sessionStorage.getItem("countryInfo");
  if (cached) return JSON.parse(cached);

  const res = await fetch("https://ipapi.co/json/");
  const data = await res.json();

  const findCountry = countries.find(
    (country) => country.isoAlpha2 === data.country_code
  );

  if (findCountry) {
    sessionStorage.setItem("countryInfo", JSON.stringify(findCountry));
    return findCountry;
  }

  const defaultCountry = countries.find(
    (country) => country.isoAlpha2 === "IN"
  );

  if (defaultCountry) {
    return defaultCountry;
  }

  return null;
}

const useCountryInfoFromIP = (toggle = false) => {
  const dispatch = useDispatch();
  const { data: countries } = useAllCountry(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (toggle && countries?.length > 0) {
      setIsLoading(true);
      getCountryInfoOnce(countries)
        .then((country) => {
          if (!country) return;

          const obj = {
            id: country._id,
            currency_code: country.currency.code,
            currency_name: country.currency.name,
            symbol: country.currency.symbol,
            country: country.name,
            flag: country.flag,
            dial_code: country.dial_code,
          };
          dispatch(initialCountryData(obj));
        })
        .finally(() => setIsLoading(false));
    }
  }, [toggle]);

  return { isLoading };
};

export default useCountryInfoFromIP;
