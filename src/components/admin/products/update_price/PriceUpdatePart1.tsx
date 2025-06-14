import React, { useMemo, useState } from "react";
import CountrySelection from "./CountrySelection";
import { useSelector } from "react-redux";
import { currencyState } from "@/redux/slice/currencySlice";
import { COUNTRY, PRODUCT_PRICE } from "@/types";
import Loading from "@/lib/Loading";
import {
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type PRODUCT_PRICE_VALUE = {
  [key: string]: PRODUCT_PRICE;
};

type Props = {
  countries: COUNTRY[];
  productPriceValue: PRODUCT_PRICE_VALUE;
  setProductPriceValue: React.Dispatch<
    React.SetStateAction<PRODUCT_PRICE_VALUE>
  >;
  isLoading: boolean;
  setFetchCountryId: (key: string) => void;
  handleNext: () => void;
};

const PriceUpdatePart1 = ({
  countries,
  productPriceValue,
  setProductPriceValue,
  isLoading,
  setFetchCountryId,
  handleNext,
}: Props) => {
  const { id } = useSelector(currencyState);

  const countryMap = useMemo(() => {
    return new Map(countries.map((country) => [country._id, country]));
  }, [countries]);

  const [countrySelected, setCountrySelected] = useState<COUNTRY | null>(() => {
    return countryMap.get(id) || null;
  });

  const handleCountrySelected = (country: COUNTRY) => {
    setCountrySelected(country);

    const isPricePresent = productPriceValue[country._id];
    if (isPricePresent) return;
    setFetchCountryId(country._id);
  };

  return (
    <main className="h-full flex flex-col">
      <AlertDialogTitle className="h-10 flex justify-center items-center border-b">
        Update Product Price
      </AlertDialogTitle>
      <div className="flex border">
        <div className="w-52 shrink-0">
          <CountrySelection
            countries={countries}
            countrySelected={countrySelected}
            handleCountrySelected={handleCountrySelected}
          />
        </div>
        {isLoading && <Loading height={"full"} small={true} />}
        {countrySelected &&
          countrySelected._id &&
          productPriceValue[countrySelected._id] && (
            <div className="p-5 space-y-3">
              <div className="text-sm flex items-center gap-2">
                <p>Country :</p>
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

              {/* MARK: PRICE */}
              <div className="text-sm flex gap-2">
                <p className="w-24 whitespace-nowrap shrink-0 mt-1">
                  Price ({countrySelected?.currency.symbol})
                </p>
                <div>
                  <input
                    value={productPriceValue[countrySelected?._id].price}
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

                      const { discountPercentage } =
                        productPriceValue[countryId];

                      const modifyDiscountedPrice =
                        (defaultPrice * (100 - discountPercentage)) / 100;

                      const updated = {
                        ...productPriceValue[countryId],
                        price: defaultPrice,
                        discountedPrice: Math.trunc(modifyDiscountedPrice),
                        errors: {
                          price: error,
                        },
                      };

                      setProductPriceValue((prev) => ({
                        ...prev,
                        [countryId]: updated,
                      }));
                    }}
                  />
                  {productPriceValue[countrySelected?._id].errors?.price && (
                    <p className="text-[10px] text-red-500">
                      {productPriceValue[countrySelected?._id].errors?.price}
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
                      productPriceValue[countrySelected?._id || ""]
                        .discountPercentage
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

                      const { price } = productPriceValue[countryId];

                      const updateDiscountedPrice =
                        (price * (100 - discount)) / 100;

                      const updated = {
                        ...productPriceValue[countryId],
                        discountPercentage: discount,
                        discountedPrice: Math.trunc(updateDiscountedPrice),
                        errors: {
                          discountPercentage: error,
                        },
                      };
                      setProductPriceValue((prev) => ({
                        ...prev,
                        [countryId]: updated,
                      }));
                    }}
                  />
                  {productPriceValue[countrySelected?._id].errors
                    ?.discountPercentage && (
                    <p className="text-[10px] text-red-500">
                      {
                        productPriceValue[countrySelected?._id].errors
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
                  value={
                    productPriceValue[countrySelected?._id].discountedPrice
                  }
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
                    value={
                      productPriceValue[countrySelected?._id].deliveryCharge
                    }
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

                      const { discountedPrice } = productPriceValue[countryId];

                      if (defaultPrice >= discountedPrice) {
                        error = "Charge is greater than Cost";
                      } else {
                        error = "";
                      }

                      const updated = {
                        ...productPriceValue[countryId],
                        deliveryCharge: defaultPrice,
                        errors: {
                          deliveryCharge: error,
                        },
                      };

                      setProductPriceValue((prev) => ({
                        ...prev,
                        [countryId]: updated,
                      }));
                    }}
                  />
                  {productPriceValue[countrySelected?._id].errors
                    ?.deliveryCharge && (
                    <p className="text-[10px] text-red-500">
                      {
                        productPriceValue[countrySelected?._id].errors
                          ?.deliveryCharge
                      }
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
      </div>
      <AlertDialogFooter className="h-20 grid grid-cols-2 items-center px-2">
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <Button disabled={isLoading} onClick={() => handleNext()}>
          Next
        </Button>
      </AlertDialogFooter>
    </main>
  );
};

export default PriceUpdatePart1;
