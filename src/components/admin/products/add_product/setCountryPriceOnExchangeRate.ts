import { ADD_PRODUCT_PRICE, COUNTRY } from "@/types";

type Props = {
  countries: COUNTRY[];
  conversionRate: number;
  currencyExchange: {
    [key: string]: number;
  };
  baseCountryProductPriceObj: ADD_PRODUCT_PRICE;
  part3Data: {
    [key: string]: ADD_PRODUCT_PRICE;
  };
  forAllOrOnlyLeft?: "forAll" | "onlyLeft";
  deliveryChargePercent?: number;
};

type OBJ = {
  [key: string]: ADD_PRODUCT_PRICE;
};

const setCountryPriceOnExchangeRate = ({
  countries,
  part3Data,
  conversionRate,
  currencyExchange,
  baseCountryProductPriceObj,
  forAllOrOnlyLeft = "onlyLeft",
  deliveryChargePercent = 5,
}: Props) => {
  const obj: OBJ = {};

  countries.forEach((country) => {
    const productPrice = part3Data[country._id];

    if (!!productPrice && forAllOrOnlyLeft === "onlyLeft") return;

    const baseCountryExchange = conversionRate;

    const selectedCountryExchangeRate = currencyExchange[
      country.currency.code
    ] as number;

    const finalExchangeValue =
      selectedCountryExchangeRate / baseCountryExchange;

    const roundFinalExchangeValue = parseFloat(finalExchangeValue.toFixed(2));

    const selectedCountryProductPrice = Math.trunc(
      baseCountryProductPriceObj.price * roundFinalExchangeValue
    );

    const discountPercentage =
      productPrice?.discountPercentage ||
      baseCountryProductPriceObj.discountPercentage ||
      0;

    const selectedCountryProductFinalPrice = Math.trunc(
      (selectedCountryProductPrice * (100 - discountPercentage)) / 100
    );

    const selectedCountryProductDeliveryCharge =
      (selectedCountryProductPrice * deliveryChargePercent) / 100;

    const updated = {
      country: country._id,
      currency_code: country.currency.code,
      exchangeRate: roundFinalExchangeValue,
      price: selectedCountryProductPrice,
      discountPercentage: discountPercentage,
      discountedPrice: selectedCountryProductFinalPrice,
      deliveryCharge: Math.trunc(selectedCountryProductDeliveryCharge),
    };

    obj[country._id] = updated;
  });

  return obj;
};

export default setCountryPriceOnExchangeRate;
