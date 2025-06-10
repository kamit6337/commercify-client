import ReactIcons from "@/assets/icons";
import { COUNTRY } from "@/types";
import { useState } from "react";

type Props = {
  countries: COUNTRY[];
  countrySelected: COUNTRY | null;
  handleCountrySelected: (value: COUNTRY) => void;
};

const CountrySelection = ({
  countries,
  countrySelected,
  handleCountrySelected,
}: Props) => {
  const [searchCountries, setSearchCountries] = useState<COUNTRY[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const handleSearchCountry = (value: string) => {
    if (!value) {
      setSearchCountries([]);
      setSearchValue("");
      return;
    }

    const findCountries = countries.filter((country) => {
      return (
        country.isoAlpha2.toLowerCase() === value.toLowerCase() ||
        country.isoAlpha3.toLowerCase() === value.toLowerCase() ||
        country.name.toLowerCase().includes(value.toLowerCase())
      );
    });

    setSearchValue(value);
    setSearchCountries(findCountries);
  };

  return (
    <div className="w-52 shrink-0">
      <div className="h-12 flex items-center px-2">
        <input
          value={searchValue}
          className="border rounded-full py-2 px-4 text-sm w-full"
          placeholder="Search Country"
          onChange={(e) => handleSearchCountry(e.target.value)}
        />
      </div>
      <div className="flex flex-col h-[327px] overflow-y-auto">
        {searchCountries.length > 0
          ? searchCountries.map((country) => {
              return (
                <div
                  key={country._id}
                  className={`${
                    countrySelected?._id === country._id ? "bg-gray-50" : ""
                  }  flex relative items-center border-b last:border-none p-2 gap-2`}
                  onClick={() => handleCountrySelected(country)}
                >
                  <div className="w-8 shrink-0">
                    <img
                      src={country.flag}
                      alt={country.name}
                      className="w-full"
                    />
                  </div>
                  <p className="text-sm">{country.name}</p>
                  {countrySelected?._id === country._id && (
                    <p className="absolute right-2 z-10 top-1/2 -translate-y-1/2 ">
                      <ReactIcons.tick />
                    </p>
                  )}
                </div>
              );
            })
          : countries.map((country) => {
              return (
                <div
                  key={country._id}
                  className={`${
                    countrySelected?._id === country._id ? "bg-gray-100" : ""
                  }  flex relative items-center border-b cursor-pointer last:border-none p-2 gap-2`}
                  onClick={() => handleCountrySelected(country)}
                >
                  <div className="w-8 shrink-0">
                    <img
                      src={country.flag}
                      alt={country.name}
                      className="w-full"
                    />
                  </div>
                  <p className="text-sm">{country.name}</p>
                  {countrySelected?._id === country._id && (
                    <p className="absolute right-2 z-10 top-1/2 -translate-y-1/2 ">
                      <ReactIcons.tick />
                    </p>
                  )}
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default CountrySelection;
