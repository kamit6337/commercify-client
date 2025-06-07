import { getReq } from "@/utils/api/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useAllCountry from "./useAllCountry";
import { COUNTRY } from "@/types";
import { useDispatch } from "react-redux";
import { initialCountryData } from "@/redux/slice/currencySlice";

const useCountryFromLatLan = (toggle = false) => {
  const dispatch = useDispatch();
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);

  const { data: countries } = useAllCountry(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLat(latitude);
          setLon(longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const query = useQuery({
    queryKey: ["location", lat, lon],
    queryFn: () => getReq("/additional/country", { lat, lon }),
    staleTime: Infinity,
    enabled: toggle && !!lat && !!lon,
  });

  useEffect(() => {
    if (query.data) {
      const countryName = query.data.country;

      const findCountry = countries.find(
        (country: COUNTRY) =>
          country.name.toLowerCase() === countryName?.toLowerCase()
      ) as COUNTRY;

      if (!findCountry) return;

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
    }
  }, [query.data]);

  return query;
};

export default useCountryFromLatLan;
