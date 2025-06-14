import { currencyState } from "@/redux/slice/currencySlice";
import { ADD_PRODUCT_PRICE, COUNTRY } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import CountrySelection from "../update_price/CountrySelection";
import {
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Toastify from "@/lib/Toastify";
import useCurrencyExchange from "@/hooks/countryAndCurrency/useCurrencyExchange";
import { Checkbox } from "@/components/ui/checkbox";
import setCountryPriceOnExchangeRate from "./setCountryPriceOnExchangeRate";

type PARTS = "part1" | "part2" | "part3" | "part4";

type PRODUCT_PRICE_VALUE = {
  [key: string]: ADD_PRODUCT_PRICE;
};

type Props = {
  countries: COUNTRY[];
  part3Data: PRODUCT_PRICE_VALUE;
  setPart3Data: React.Dispatch<React.SetStateAction<PRODUCT_PRICE_VALUE>>;
  setStage: (value: PARTS) => void;
};

const Part3 = ({ setStage, countries, part3Data, setPart3Data }: Props) => {
  const { data: currencyExchange } = useCurrencyExchange();
  const { id, currency_code, conversionRate, country } =
    useSelector(currencyState);
  const { showAlertMessage, showErrorMessage } = Toastify();
  const [countrySelected, setCountrySelected] = useState<COUNTRY | null>(() => {
    return countries.find((country) => country._id === id) || null;
  });

  const [isCheckedDefaultPrice, setIsCheckedDefaultPrice] =
    useState<boolean>(true);

  const [isCheckedForAllOrleft, setIsCheckedForAllOrLeft] = useState<
    "forAll" | "onlyLeft"
  >("onlyLeft");

  const [isOpenSetPriceForAll, setIsOpenSetPriceForAll] = useState(false);

  const baseCountryProductPriceObj = useMemo(() => {
    return part3Data[id];
  }, [id, part3Data]);

  useEffect(() => {
    if (countrySelected) {
      const countryId = countrySelected._id;
      const selectedCountryProduct = part3Data[countryId];
      if (!selectedCountryProduct) return;

      const selectedCountryProductPrice = Math.trunc(
        baseCountryProductPriceObj.price * selectedCountryProduct.exchangeRate
      );

      if (selectedCountryProductPrice === selectedCountryProduct.price) {
        setIsCheckedDefaultPrice(true);
      } else {
        setIsCheckedDefaultPrice(false);
      }
    }
  }, [countrySelected]);

  const handleCountrySelected = (country: COUNTRY) => {
    const baseCountryProductPrice = part3Data[id];

    if (!baseCountryProductPrice || !baseCountryProductPrice.price) {
      showAlertMessage({ message: "Please fill all data" });
      return;
    }

    const updated = setCountryPriceOnExchangeRate({
      countries: [country],
      baseCountryProductPriceObj: baseCountryProductPriceObj,
      conversionRate: conversionRate,
      currencyExchange: currencyExchange,
      part3Data: part3Data,
      forAllOrOnlyLeft: "onlyLeft",
    });

    setPart3Data((prev) => ({
      ...prev,
      ...updated,
    }));

    setCountrySelected(country);
  };

  const handleCheckBox = (value: boolean) => {
    if (!countrySelected) return;

    const selectedCountryProduct = part3Data[countrySelected._id];
    const baseCountryExchange = conversionRate;
    const selectedCountryExchangeRate = currencyExchange[
      countrySelected.currency.code
    ] as number;

    const finalExchangeValue =
      selectedCountryExchangeRate / baseCountryExchange;

    const roundFinalExchangeValue = parseFloat(finalExchangeValue.toFixed(2));

    const selectedCountryProductPrice = Math.trunc(
      baseCountryProductPriceObj.price * roundFinalExchangeValue
    );

    const selectedCountryProductFinalPrice =
      (selectedCountryProductPrice *
        (100 - selectedCountryProduct.discountPercentage)) /
      100;

    const updated = {
      ...selectedCountryProduct,
      price: selectedCountryProductPrice,
      discountedPrice: selectedCountryProductFinalPrice,
    };

    setPart3Data((prev) => ({
      ...prev,
      [countrySelected._id]: updated,
    }));

    setIsCheckedDefaultPrice(value);
  };

  const handleNext = () => {
    const countryPriceLeft: string[] = [];

    const errorCountryNameList: string[] = [];

    countries.forEach((country) => {
      const priceObj = part3Data[country._id];

      if (!priceObj || !priceObj.price) {
        countryPriceLeft.push(country.name);
        return;
      }

      if (!priceObj.errors) return;

      const errorList = Object.values(priceObj.errors);

      const filter = errorList.filter((error) => !!error);

      if (filter.length === 0) return;

      errorCountryNameList.push(country.name || "");
    });

    if (countryPriceLeft.length === 0 && errorCountryNameList.length === 0) {
      setStage("part4");
      return;
    }

    if (countryPriceLeft.length > 0) {
      let msg = "";

      if (countryPriceLeft.length > 3) {
        const slice3Countries = countryPriceLeft.slice(0, 3);

        msg = `Please fill Price for Countries. ${slice3Countries.join(
          ", "
        )} and other ${
          countryPriceLeft.length - slice3Countries.length
        } countries`;
      } else {
        msg = `Please fill Price for Countries. ${countryPriceLeft.join(", ")}`;
      }

      showErrorMessage({ message: msg });
      return;
    }

    const errorMsg = `Error in Price for Countries. ${errorCountryNameList.join(
      ", "
    )}`;

    showErrorMessage({ message: errorMsg });
  };

  const handleSetPriceForAll = () => {
    if (
      !baseCountryProductPriceObj.price ||
      !countries ||
      countries.length === 0
    ) {
      showAlertMessage({
        message: `First set the Price for Base Country (${country})`,
      });
      return;
    }

    const updated = setCountryPriceOnExchangeRate({
      countries: countries,
      baseCountryProductPriceObj: baseCountryProductPriceObj,
      conversionRate: conversionRate,
      currencyExchange: currencyExchange,
      part3Data: part3Data,
      forAllOrOnlyLeft: isCheckedForAllOrleft,
    });

    setPart3Data((prev) => ({
      ...prev,
      ...updated,
    }));

    setIsOpenSetPriceForAll(false);
  };

  return (
    <>
      <main className="h-full flex flex-col">
        <AlertDialogTitle className="h-10 flex justify-center items-center border-b">
          Add Product Price
        </AlertDialogTitle>
        <div className="flex-1 flex border">
          <CountrySelection
            countries={countries}
            countrySelected={countrySelected}
            handleCountrySelected={handleCountrySelected}
          />
          {countrySelected?._id && part3Data[countrySelected._id] && (
            <div className="p-5 space-y-2">
              <div className="text-sm flex gap-2">
                <p className="whitespace-nowrap">Country :</p>
                <p className="font-semibold tracking-wider">
                  {countrySelected?.name}
                </p>
              </div>
              <div className="text-sm flex items-center gap-2">
                <p>Currency Name :</p>
                <p className="font-semibold tracking-wider">
                  {countrySelected?.currency.name}
                </p>
              </div>
              <div className="text-sm flex items-center gap-2">
                <p>Currency Code :</p>
                <p className="font-semibold tracking-wider">
                  {countrySelected?.currency.code}
                </p>
              </div>

              {/* MARK: EXCHANGE RATE */}
              <div className="text-sm">
                1 {currency_code} ={" "}
                {part3Data[countrySelected._id].exchangeRate}{" "}
                {part3Data[countrySelected._id].currency_code}
              </div>

              {/* MARK: DEFAULT TO EXCHANGE RATE */}
              {countrySelected._id !== id ? (
                <div className="flex items-center gap-1">
                  <div>
                    <Checkbox
                      disabled={isCheckedDefaultPrice}
                      checked={isCheckedDefaultPrice}
                      onCheckedChange={(value) =>
                        handleCheckBox(value === true)
                      }
                    />
                  </div>
                  <div className="text-xs">
                    <p>Price default to Exchange Rate</p>
                    <p>
                      (Base = {country} ({currency_code}
                      ))
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end">
                  <button
                    className="text-end text-xs border rounded px-5 py-1 bg-sky-300"
                    onClick={() => {
                      if (
                        !baseCountryProductPriceObj ||
                        !baseCountryProductPriceObj.price
                      ) {
                        showAlertMessage({
                          message: "Fill Price for Base Country",
                        });
                        return;
                      }
                      setIsOpenSetPriceForAll(true);
                    }}
                  >
                    Set Price for All Country
                  </button>
                </div>
              )}

              {/* MARK: PRICE */}
              <div className="text-sm flex gap-2">
                <p className="w-24 whitespace-nowrap shrink-0 mt-1">
                  Price ({countrySelected?.currency.symbol})
                </p>
                <div>
                  <input
                    value={part3Data[countrySelected?._id].price}
                    className="border rounded py-1 px-2 text-sm w-full"
                    onChange={(e) => {
                      const countryId = countrySelected?._id;
                      if (!countryId) return;

                      const number = parseFloat(e.target.value);

                      let defaultPrice = 0;

                      let error = "";

                      if (!number || isNaN(number) || number <= 0) {
                        error = "Price must be greater than 0";
                        defaultPrice = 0;
                      } else {
                        error = "";
                        defaultPrice = number;
                      }

                      const { discountPercentage, exchangeRate } =
                        part3Data[countryId];

                      const selectedCountryProductPrice = Math.trunc(
                        baseCountryProductPriceObj.price * exchangeRate
                      );

                      if (selectedCountryProductPrice === defaultPrice) {
                        setIsCheckedDefaultPrice(true);
                      } else {
                        setIsCheckedDefaultPrice(false);
                      }

                      const modifyDiscountedPrice =
                        (defaultPrice * (100 - discountPercentage)) / 100;

                      const updated = {
                        ...part3Data[countryId],
                        price: defaultPrice,
                        discountedPrice: Math.trunc(modifyDiscountedPrice),
                        errors: {
                          price: error,
                        },
                      };

                      setPart3Data((prev) => ({
                        ...prev,
                        [countryId]: updated,
                      }));
                    }}
                  />
                  {part3Data[countrySelected?._id].errors?.price && (
                    <p className="text-[10px] text-red-500">
                      {part3Data[countrySelected?._id].errors?.price}
                    </p>
                  )}
                </div>
              </div>

              {/* MARK: DISCOUNT */}

              <div className="text-sm flex gap-2">
                <p className="w-24 whitespace-nowrap shrink-0 mt-1">
                  Discount (%)
                </p>
                <div>
                  <input
                    value={
                      part3Data[countrySelected?._id || ""].discountPercentage
                    }
                    className="border rounded py-1 px-2 text-sm w-full"
                    onChange={(e) => {
                      const countryId = countrySelected?._id;
                      if (!countryId) return;

                      const number = parseFloat(e.target.value);

                      const discount = number || 0;

                      let error = "";

                      if (discount < 0 || discount > 100) {
                        error = "Must be within 0-100";
                      } else {
                        error = "";
                      }

                      const { price } = part3Data[countryId];

                      const updateDiscountedPrice =
                        (price * (100 - discount)) / 100;

                      const updated = {
                        ...part3Data[countryId],
                        discountPercentage: discount,
                        discountedPrice: Math.trunc(updateDiscountedPrice),
                        errors: {
                          discountPercentage: error,
                        },
                      };
                      setPart3Data((prev) => ({
                        ...prev,
                        [countryId]: updated,
                      }));
                    }}
                  />
                  {part3Data[countrySelected?._id].errors
                    ?.discountPercentage && (
                    <p className="text-[10px] text-red-500">
                      {
                        part3Data[countrySelected?._id].errors
                          ?.discountPercentage
                      }
                    </p>
                  )}
                </div>
              </div>

              {/* MARK: FINAL PRICE */}

              <div className="text-sm flex items-center gap-2">
                <p className="w-24 whitespace-nowrap shrink-0">
                  Final Price ({countrySelected?.currency.symbol})
                </p>
                <input
                  value={part3Data[countrySelected?._id].discountedPrice}
                  readOnly={true}
                  className="border rounded py-1 px-2 text-sm w-full"
                />
              </div>

              {/* MARK: DELIVERY PRICE */}

              <div className="text-sm flex  gap-2">
                <p className="w-24 shrink-0 mt-1">
                  Delivery Charge ({countrySelected?.currency.symbol})
                </p>
                <div>
                  <input
                    value={part3Data[countrySelected?._id].deliveryCharge}
                    className="border rounded py-1 px-2 text-sm w-full"
                    onChange={(e) => {
                      const countryId = countrySelected?._id;
                      if (!countryId) return;

                      const number = parseFloat(e.target.value);

                      let defaultPrice = 0;

                      let error = "";

                      if (!number || isNaN(number) || number <= 0) {
                        error = "Price must be greater than 0";
                        defaultPrice = 0;
                      } else {
                        error = "";
                        defaultPrice = number;
                      }

                      const { discountedPrice } = part3Data[countryId];

                      if (defaultPrice >= discountedPrice) {
                        error = "Charge is greater than Cost";
                      } else {
                        error = "";
                      }

                      const updated = {
                        ...part3Data[countryId],
                        deliveryCharge: defaultPrice,
                        errors: {
                          deliveryCharge: error,
                        },
                      };

                      setPart3Data((prev) => ({
                        ...prev,
                        [countryId]: updated,
                      }));
                    }}
                  />
                  {part3Data[countrySelected?._id].errors?.deliveryCharge && (
                    <p className="text-[10px] text-red-500">
                      {part3Data[countrySelected?._id].errors?.deliveryCharge}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <AlertDialogFooter className="h-20 flex px-2 items-center">
          <AlertDialogCancel
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
              setStage("part2");
            }}
          >
            Back
          </AlertDialogCancel>

          <Button className="w-full" type="submit" onClick={() => handleNext()}>
            Next
          </Button>
        </AlertDialogFooter>
      </main>
      {isOpenSetPriceForAll && (
        <div className="w-full h-full fixed top-0 z-50 flex justify-center items-center backdrop-blur-sm backdrop-grayscale ">
          <div className="w-3/4 bg-background flex flex-col justify-between rounded-md border-2 ">
            <div className="p-5 space-y-5">
              <p className="text-sm ">
                You can set Product Price for all Countries or left Countries
                based on exchange rate (Base Currency = {currency_code})
              </p>
              <div className="grid grid-cols-2 text-xs">
                <div className="flex items-center gap-1">
                  <Checkbox
                    checked={isCheckedForAllOrleft === "forAll"}
                    onCheckedChange={() => setIsCheckedForAllOrLeft("forAll")}
                  />
                  <p>For All Countries</p>
                </div>
                <div className="flex items-center gap-1">
                  <Checkbox
                    checked={isCheckedForAllOrleft === "onlyLeft"}
                    onCheckedChange={() => setIsCheckedForAllOrLeft("onlyLeft")}
                  />
                  <p>Only Left Countries</p>
                </div>
              </div>
              <p>Are you sure to change ?</p>
            </div>
            <AlertDialogFooter className="flex p-2 items-center">
              <AlertDialogCancel
                className="w-full"
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpenSetPriceForAll(false);
                }}
              >
                Cancel
              </AlertDialogCancel>

              <Button
                className="w-full"
                type="submit"
                onClick={() => handleSetPriceForAll()}
              >
                Change
              </Button>
            </AlertDialogFooter>
          </div>
        </div>
      )}
    </>
  );
};

export default Part3;
