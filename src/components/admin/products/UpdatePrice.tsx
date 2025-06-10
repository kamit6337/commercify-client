import ReactIcons from "@/assets/icons";
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useAllCountry from "@/hooks/countryAndCurrency/useAllCountry";
import useProductPrice from "@/hooks/products/useProductPrice";
import Loading from "@/lib/Loading";
import { currencyState } from "@/redux/slice/currencySlice";
import { COUNTRY, PRODUCT, PRODUCT_PRICE } from "@/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import CountrySelection from "./CountrySelection";
import { useForm } from "react-hook-form";

type Props = {
  product: PRODUCT;
};

type PRODUCT_PRICE_VALUE = {
  [key: string]: PRODUCT_PRICE;
};

const UpdatePrice = ({ product }: Props) => {
  const { data } = useAllCountry();
  const countries = data as COUNTRY[];

  countries.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );

  const countryMap = useMemo(() => {
    return new Map(countries.map((country) => [country._id, country]));
  }, [countries]);

  const closeRef = useRef<HTMLButtonElement>(null);
  const [isPending, setIsPending] = useState(false);
  const { id } = useSelector(currencyState);

  const [countrySelected, setCountrySelected] = useState<COUNTRY | null>(() => {
    return countryMap.get(id) || null;
  });

  const { register, handleSubmit } = useForm({
    defaultValues: {
      price: 0,
      discountPercentage: 0,
      discountedPrice: 0,
      deliveryCharge: 0,
    },
  });

  const [fetchCountryId, setFetchCountryId] = useState(id);

  const { isLoading, data: productPrice } = useProductPrice(
    product._id,
    fetchCountryId
  );

  const [productPriceValue, setProductPriceValue] =
    useState<PRODUCT_PRICE_VALUE>({});

  useEffect(() => {
    if (productPrice) {
      const price = productPrice as PRODUCT_PRICE;
      const key = price.country;

      setProductPriceValue((prev) => ({
        ...prev,
        [key]: price,
      }));
    }
  }, [productPrice]);

  const handleCountrySelected = (country: COUNTRY) => {
    setCountrySelected(country);

    const isPricePresent = productPriceValue[country._id];
    if (isPricePresent) return;
    setFetchCountryId(country._id);
  };

  const onSubmit = () => {};

  return (
    <AlertDialogContent className="p-0 max-h-[500px] overflow-y-auto gap-0">
      <AlertDialogTitle className="h-10 flex justify-center items-center">
        Update Product Sale
      </AlertDialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex border">
          <CountrySelection
            countries={countries}
            countrySelected={countrySelected}
            handleCountrySelected={handleCountrySelected}
          />
          {isLoading && <Loading height={"full"} small={true} />}
          {countrySelected && productPriceValue[countrySelected._id] && (
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
              <div className="text-sm flex items-center gap-2">
                <p className="w-24 whitespace-nowrap shrink-0">
                  Price ({countrySelected?.currency.symbol})
                </p>
                <input
                  value={productPriceValue[countrySelected?._id || ""].price}
                  className="border rounded py-1 px-2 text-sm w-full"
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    const countryId = countrySelected?._id;
                    if (!countryId) return;

                    const { discountPercentage } = productPriceValue[countryId];

                    const updateDiscountedPrice =
                      (value * (100 - discountPercentage)) / 100;

                    const updated = {
                      ...productPriceValue[countryId],
                      price: value,
                      discountedPrice: Math.trunc(updateDiscountedPrice),
                    };
                    setProductPriceValue((prev) => ({
                      ...prev,
                      [countryId]: updated,
                    }));
                  }}
                />
              </div>
              <div className="text-sm flex items-center gap-2">
                <p className="w-24 whitespace-nowrap shrink-0">Discount (%)</p>
                <input
                  value={
                    productPriceValue[countrySelected?._id || ""]
                      .discountPercentage
                  }
                  className="border rounded py-1 px-2 text-sm w-full"
                  onChange={(e) => {
                    const countryId = countrySelected?._id;
                    if (!countryId) return;

                    let discount = 0;

                    if (e.target.value) {
                      discount = parseFloat(e.target.value);
                    } else {
                      discount = 0;
                    }

                    const { price } = productPriceValue[countryId];

                    const updateDiscountedPrice =
                      (price * (100 - discount)) / 100;

                    const updated = {
                      ...productPriceValue[countryId],
                      discountPercentage: discount,
                      discountedPrice: Math.trunc(updateDiscountedPrice),
                    };
                    setProductPriceValue((prev) => ({
                      ...prev,
                      [countryId]: updated,
                    }));
                  }}
                />
              </div>
              <div className="text-sm flex items-center gap-2">
                <p className="w-24 whitespace-nowrap shrink-0">
                  Final Price ({countrySelected?.currency.symbol})
                </p>
                <input
                  value={
                    productPriceValue[countrySelected?._id || ""]
                      .discountedPrice
                  }
                  className="border rounded py-1 px-2 text-sm w-full"
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    const countryId = countrySelected?._id;
                    if (!countryId) return;

                    const updated = {
                      ...productPriceValue[countryId],
                      discountedPrice: value,
                    };
                    setProductPriceValue((prev) => ({
                      ...prev,
                      [countryId]: updated,
                    }));
                  }}
                />
              </div>
              <div className="text-sm flex items-center gap-2">
                <p className="w-24 shrink-0">
                  Delivery Charge ({countrySelected?.currency.symbol})
                </p>
                <input
                  value={
                    productPriceValue[countrySelected?._id || ""].deliveryCharge
                  }
                  className="border rounded py-1 px-2 text-sm w-full"
                />
              </div>
            </div>
          )}
        </div>
        <AlertDialogFooter className="h-20 flex px-2 items-center">
          <AlertDialogCancel ref={closeRef} className="w-full">
            Cancel
          </AlertDialogCancel>
          <Button className="w-full" type="submit">
            {isPending ? <Loading small={true} height={"full"} /> : "Submit"}
          </Button>
        </AlertDialogFooter>
      </form>
    </AlertDialogContent>
  );
};

export default UpdatePrice;
