import { COUNTRY, PRODUCT_PRICE } from "@/types";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";

type PRODUCT_PRICE_VALUE = {
  [key: string]: PRODUCT_PRICE;
};

type Props = {
  updatedPriceValue: PRODUCT_PRICE_VALUE;
  countries: COUNTRY[];
  setIsSubmit: (key: boolean) => void;
};

const PriceConfirmPart2 = ({
  updatedPriceValue,
  countries,
  setIsSubmit,
}: Props) => {
  const countryMap = useMemo(() => {
    return new Map(countries.map((country) => [country._id, country]));
  }, [countries]);

  const { ref, inView } = useInView();

  useEffect(() => {
    setIsSubmit(inView);
  }, [inView]);

  const countryIds = Object.keys(updatedPriceValue);

  if (countryIds.length === 0) {
    return (
      <div className="h-full flex justify-center items-center">
        <p>No Price Update</p>
        <div ref={ref} />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {countryIds.map((countryId) => {
        const country = countryMap.get(countryId);

        const obj = updatedPriceValue[countryId];

        return (
          <div key={obj._id} className="text-sm space-y-5 border-b p-4">
            <div className="">
              <div className="flex items-center gap-1 whitespace-nowrap">
                <p>Country :</p>
                <p className="font-semibold tracking-wider text-blue-500">
                  {country?.name}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <p>Currency Code :</p>
                <p>{country?.currency.code}</p>
              </div>
              <div className="flex items-center gap-1">
                <p>Currency Name :</p>
                <p>{country?.currency.name}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-y-2">
              <div className="flex items-center gap-1">
                <p className="font-semibold tracking-wider text-sky-500">
                  Price :
                </p>
                <p>
                  {country?.currency.symbol}
                  {obj.price}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <p className="font-semibold tracking-wider text-sky-500">
                  Discount :
                </p>
                <p>{obj.discountPercentage}%</p>
              </div>
              <div className="flex items-center gap-1">
                <p className="font-semibold tracking-wider text-sky-500">
                  Final Price :
                </p>
                <p>
                  {country?.currency.symbol}
                  {obj.discountedPrice}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <p className="font-semibold tracking-wider text-sky-500 whitespace-nowrap">
                  Delivery Charge :
                </p>
                <p>
                  {country?.currency.symbol}
                  {obj.deliveryCharge}
                </p>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={ref} />
    </div>
  );
};

export default PriceConfirmPart2;
