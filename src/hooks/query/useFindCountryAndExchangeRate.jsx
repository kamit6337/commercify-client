import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import environment from "../../utils/environment";
import countries from "../../data/countries";
import { useDispatch } from "react-redux";
import { initialCurrencyData } from "../../redux/slice/currencySlice";

const GEO_API_URL = "https://api.geoapify.com/v1/geocode/reverse";
const CURRENCY_EXCHANGE_URL = "https://api.freecurrencyapi.com/v1/latest";

const useFindCountryAndExchangeRate = (toggle = false) => {
  const dispatch = useDispatch();
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((data) => {
        const { latitude, longitude } = data.coords;

        setLatitude(latitude);
        setLongitude(longitude);
      });
    }
  }, []);

  const queryGeoLoc = useQuery({
    queryKey: ["find country based on lat and lon"],
    queryFn: async () => {
      const response = await axios.get(GEO_API_URL, {
        params: {
          lat: latitude,
          lon: longitude,
          apiKey: environment.GEO_API_KEY,
        },
      });
      return response?.data;
    },
    staleTime: Infinity,
    enabled: toggle && !!latitude && !!longitude,
  });

  const queryCurrencyExchange = useQuery({
    queryKey: ["currency exchange"],
    queryFn: async () => {
      const response = await axios.get(CURRENCY_EXCHANGE_URL, {
        params: {
          apikey: environment.CURRENCY_EXCHANGE_KEY,
        },
      });
      return response?.data;
    },
    staleTime: Infinity,
    enabled: toggle,
  });

  useEffect(() => {
    if (queryGeoLoc.isSuccess) {
      const { features } = queryGeoLoc.data;
      const {
        properties: { country },
      } = features[0];

      const findCountryInfo = countries.find(
        (nation) => nation.name === country
      );

      const obj = findCountryInfo.currency;

      if (queryCurrencyExchange.isSuccess) {
        const { data: currencyData } = queryCurrencyExchange.data;

        const exchangeValue = currencyData[obj.code];

        obj.exchangeRate = exchangeValue || 1;
      }

      dispatch(initialCurrencyData(obj));
    }
  }, [queryGeoLoc, dispatch, queryCurrencyExchange]);

  return {
    isLoading: queryGeoLoc.isLoading || queryCurrencyExchange.isLoading,
    error: queryCurrencyExchange.error || queryGeoLoc.error,
  };
};

export default useFindCountryAndExchangeRate;
