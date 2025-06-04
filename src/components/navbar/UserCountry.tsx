import useCountryFromLatLan from "@/hooks/countryAndCurrency/useCountryFromLatLan";
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
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Toastify from "@/lib/Toastify";
import useAllCountry from "@/hooks/countryAndCurrency/useAllCountry";
import { COUNTRY } from "@/types";
import useCurrencyExchange from "@/hooks/countryAndCurrency/useCurrencyExchange";
import VirtualList from "@/lib/VirtualList";

const UserCountry = () => {
  const dispatch = useDispatch();
  const [lan, setLan] = useState(0);
  const [lon, setLon] = useState(0);
  const { id: countryId, currency_name, flag } = useSelector(currencyState);
  const {
    isLoading: isLoadingAllCountry,
    error: errorAllCountry,
    data: countries,
    isSuccess: isSuccessAllCountry,
  } = useAllCountry();

  const {
    isLoading: isLoadingCurrency,
    error: errorCurrency,
    data: currencyExchange,
    isSuccess: isSuccessCurrency,
  } = useCurrencyExchange(isSuccessAllCountry);

  const { data, error, isLoading } = useCountryFromLatLan(
    isSuccessAllCountry && isSuccessCurrency,
    lan,
    lon
  );

  const { showErrorMessage } = Toastify();

  useEffect(() => {
    if (error) {
      showErrorMessage({ message: error.message });
      return;
    }
    if (errorAllCountry) {
      showErrorMessage({ message: errorAllCountry.message });
      return;
    }
    if (errorCurrency) {
      showErrorMessage({ message: errorCurrency.message });
    }
  }, [error, errorAllCountry, errorCurrency]);

  useEffect(() => {
    if (data) {
      const countryName = data.country;

      const findCountry = countries.find(
        (country: COUNTRY) =>
          country.name.toLowerCase() === countryName?.toLowerCase()
      ) as COUNTRY;

      if (!findCountry) return;

      const conversionRate = currencyExchange[findCountry.currency.code];

      const obj = {
        id: findCountry._id,
        code: findCountry.currency.code,
        name: findCountry.currency.name,
        symbol: findCountry.currency.symbol,
        country: findCountry.name,
        dial_code: findCountry.dial_code,
        flag: findCountry.flag,
        conversionRate,
      };
      dispatch(initialCurrencyData(obj));
    }
  }, [data]);

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

  if (isLoadingAllCountry || isLoadingCurrency || isLoading) {
    return <Loading height={"full"} small={true} />;
  }

  const handleCountryChange = (id: string) => {
    const findCountry = countries.find(
      (country: COUNTRY) => country._id === id
    );

    if (!findCountry) return;

    const obj = {
      id: findCountry._id,
      code: findCountry.currency.code,
      name: findCountry.currency.name,
      symbol: findCountry.currency.symbol,
      country: findCountry.name,
      dial_code: findCountry.dial_code,
      flag: findCountry.flag,
    };
    dispatch(initialCurrencyData(obj));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-10">
          <img src={flag} alt={currency_name} className="w-full object-cover" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 p-0" align="end">
        <VirtualList
          items={countries}
          itemHeight={50}
          renderItem={(country: COUNTRY) => (
            <DropdownMenuCheckboxItem
              key={country._id}
              checked={country._id === countryId}
              className="flex items-center justify-center gap-2"
              onClick={() => handleCountryChange(country._id)}
            >
              <div className="w-10">
                <img
                  src={country.flag}
                  alt={country.name}
                  loading="lazy"
                  className="w-full object-cover"
                />
              </div>
              <p className="flex-1">{country.name}</p>
            </DropdownMenuCheckboxItem>
          )}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserCountry;

// {countries.map((country: COUNTRY) => {
//     const { _id, name, flag } = country;

//     return (
//       <DropdownMenuCheckboxItem
//         key={_id}
//         checked={_id === countryId}
//         className="flex items-center justify-center gap-2"
//         onClick={() => handleCountryChange(_id)}
//       >
//         <div className="w-10">
//           <img src={flag} alt={name} className="w-full object-cover" />
//         </div>
//         <p className="flex-1">{name}</p>
//       </DropdownMenuCheckboxItem>
//     );
//   })}
