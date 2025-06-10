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
} from "@/components/ui/dropdown-menu";
import Toastify from "@/lib/Toastify";
import { COUNTRY } from "@/types";
import useCurrencyExchange from "@/hooks/countryAndCurrency/useCurrencyExchange";
import VirtualList from "@/lib/VirtualList";
import useAllCountry from "@/hooks/countryAndCurrency/useAllCountry";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const UserCountry = () => {
  const [countrySelected, setCountrySelected] = useState<COUNTRY | null>(null);
  const dispatch = useDispatch();
  const {
    id: countryId,
    currency_name,
    flag,
    currency_code,
  } = useSelector(currencyState);

  const { data: countries } = useAllCountry();

  const {
    isLoading: isLoadingCurrency,
    error: errorCurrency,
    data: currencyExchange,
  } = useCurrencyExchange();

  useEffect(() => {
    if (currencyExchange) {
      const conversionRate = currencyExchange[currency_code];
      dispatch(initialCurrencyData(conversionRate));
    }
  }, [currencyExchange]);

  const { showErrorMessage } = Toastify();

  useEffect(() => {
    if (errorCurrency) {
      showErrorMessage({ message: errorCurrency.message });
    }
  }, [errorCurrency]);

  if (isLoadingCurrency) {
    return <Loading height={"full"} small={true} />;
  }

  const handleCountryChange = (country: COUNTRY) => {
    setCountrySelected(country);
  };

  const handleSubmit = () => {
    sessionStorage.setItem("country", countrySelected?._id || "");

    window.location.reload();
  };

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="w-10">
            <img
              src={flag}
              alt={currency_name}
              loading="lazy"
              className="w-full object-cover"
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72 p-0" align="end">
          <VirtualList
            items={countries}
            itemHeight={50}
            renderItem={(country: COUNTRY) => (
              <AlertDialogTrigger className="w-full">
                <DropdownMenuCheckboxItem
                  key={country._id}
                  checked={country._id === countryId}
                  className="flex items-center gap-2"
                  onClick={() => handleCountryChange(country)}
                >
                  <div className="w-10">
                    <img
                      src={country.flag}
                      alt={country.name}
                      loading="lazy"
                      className="w-full object-cover"
                    />
                  </div>
                  <p className="">{country.name}</p>
                </DropdownMenuCheckboxItem>
              </AlertDialogTrigger>
            )}
          />
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <div className="space-y-5">
          <p className="font-semibold text-lg">
            You have selected : {countrySelected?.name}
          </p>
          <div className="space-y-5">
            <p>
              The price of products will change according to{" "}
              {countrySelected?.name}.
            </p>
            <p>
              Are you sure to change ? It will need complete reload of pages.
            </p>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>Submit</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UserCountry;
