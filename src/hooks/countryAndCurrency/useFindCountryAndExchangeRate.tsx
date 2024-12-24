import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import environment from "../../utils/environment";
import { useDispatch } from "react-redux";
import { initialCurrencyData } from "../../redux/slice/currencySlice";
import { useNavigate } from "react-router-dom";
import countries from "@/data/countries";

const CURRENCY_EXCHANGE_URL = "https://api.freecurrencyapi.com/v1/latest";

const useFindCountryAndExchangeRate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const query = useQuery({
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
  });

  useEffect(() => {
    if (query.isSuccess) {
      const id = localStorage.getItem("_cou");

      if (!id) {
        return;
      }

      const findCountryInfo = countries.find(
        (nation) => nation.id === Number(id)
      );

      const obj = findCountryInfo?.currency;

      const { data: currencyData } = query.data;

      const exchangeValue =
        findCountryInfo &&
        (currencyData[findCountryInfo.currency.code] as number);

      localStorage.setItem("_exra", Math.trunc(exchangeValue) || 1);

      const newObj = {
        ...obj,
      };

      newObj.exchangeRate = exchangeValue;
      newObj.country = findCountryInfo.name;

      dispatch(initialCurrencyData(obj));
    }
  }, [dispatch, query, navigate]);

  return query;
};

export default useFindCountryAndExchangeRate;
