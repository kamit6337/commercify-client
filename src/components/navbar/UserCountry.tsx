import countries from "@/data/countries";
import useCountryFromLatLan from "@/hooks/countryAndCurrency/useCountryFromLatLan";
import useCurrencyExchange from "@/hooks/countryAndCurrency/useCurrencyExchange";
import Loading from "@/lib/Loading";
import {
  currencyState,
  initialCurrencyData,
} from "@/redux/slice/currencySlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Toastify from "@/lib/Toastify";

const UserCountry = () => {
  const dispatch = useDispatch();
  const [lan, setLan] = useState(0);
  const [lon, setLon] = useState(0);
  const { id: countryId, name, flag } = useSelector(currencyState);
  const { data, error, isLoading } = useCountryFromLatLan(lan, lon);

  const { showErrorMessage } = Toastify();

  const {
    data: currencyExchange,
    error: errorCurrencyExchange,
    isLoading: isLoadingCurrencyExchange,
  } = useCurrencyExchange();

  useEffect(() => {
    if (error) {
      showErrorMessage({ message: error.message });
      return;
    }
    if (errorCurrencyExchange) {
      showErrorMessage({ message: errorCurrencyExchange.message });
    }
  }, [error, errorCurrencyExchange]);

  useEffect(() => {
    if (data && currencyExchange) {
      const countryName = data.country;

      const countryInfo = countries.find(
        (country) => country.name.toLowerCase() === countryName?.toLowerCase()
      );

      const currencyCode = countryInfo?.currency.code;

      const getExchangeRate = currencyExchange[currencyCode || "INR"];

      const obj = {
        id: countryInfo?.id,
        code: currencyCode,
        name: countryInfo?.currency.name,
        symbol: countryInfo?.currency.symbol,
        exchangeRate: getExchangeRate,
        country: countryInfo?.name,
        dial_code: countryInfo?.dial_code,
        flag: countryInfo?.flag,
      };
      dispatch(initialCurrencyData(obj));
    }
  }, [data, currencyExchange]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLan(latitude);
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

  if (isLoading || isLoadingCurrencyExchange) {
    return <Loading height={"full"} small={true} />;
  }

  const handleCountryChange = (id: number) => {
    if (errorCurrencyExchange) {
      showErrorMessage({ message: errorCurrencyExchange.message });
      return;
    }

    const countryInfo = countries.find((country) => country.id === id);
    const currencyCode = countryInfo?.currency.code;
    const getExchangeRate = currencyExchange[currencyCode || "INR"];

    const obj = {
      id: countryInfo?.id,
      code: currencyCode,
      country: countryInfo?.name,
      exchangeRate: getExchangeRate,
      name: countryInfo?.currency.name,
      symbol: countryInfo?.currency.symbol,
      flag: countryInfo?.flag,
    };
    dispatch(initialCurrencyData(obj));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-10">
          <img
            src={`data:image/png;base64,${flag}`}
            alt={name}
            className="w-full object-cover"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align="end">
        {countries.map((country) => {
          const { id, name, flag } = country;

          return (
            <DropdownMenuCheckboxItem
              key={id}
              checked={id === countryId}
              className="flex items-center justify-center gap-2"
              onClick={() => handleCountryChange(id)}
            >
              <div className="w-10">
                <img
                  src={`data:image/png;base64,${flag}`}
                  alt={name}
                  className="w-full object-cover"
                />
              </div>
              <p className="flex-1">{name}</p>
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserCountry;
