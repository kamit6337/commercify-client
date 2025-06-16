import {
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAllCategory from "@/hooks/category/useAllCategory";
import Loading from "@/lib/Loading";
import { currencyState } from "@/redux/slice/currencySlice";
import { ADD_PRODUCT_PRICE, CATEGORY, COUNTRY } from "@/types";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

type PARTS = "part1" | "part2" | "part3" | "part4";

type Part1DataType = {
  title: string;
  description: string;
  deliveredBy: number;
  category: string;
};

type Props = {
  selectedImage: File | null;
  part1Data: Part1DataType;
  part2Data: number;
  part3Data: {
    [key: string]: ADD_PRODUCT_PRICE;
  };
  countries: COUNTRY[];
  setStage: (value: PARTS) => void;
  isPending: boolean;
  onSubmit: () => void;
  closeRef: React.RefObject<HTMLButtonElement>;
};

const Part4 = ({
  selectedImage,
  part1Data,
  part2Data,
  part3Data,
  countries,
  setStage,
  isPending,
  onSubmit,
  closeRef,
}: Props) => {
  const { data } = useAllCategory();
  const {
    id,
    currency_code,
    country,
    currency_name,
    symbol: baseCountryCurrencySymbol,
  } = useSelector(currencyState);
  const allCategory = data as CATEGORY[];

  const baseCountryProductPriceObj = useMemo(() => {
    return part3Data[id];
  }, [id, part3Data]);

  const countryMap = useMemo(() => {
    return new Map(countries.map((country) => [country._id, country]));
  }, [countries]);

  const findCategory = useMemo(() => {
    return allCategory.find((category) => category._id === part1Data.category);
  }, [allCategory, part1Data.category]);

  const [selectedCountry, setSelectedCountry] = useState(id);

  const selectedCountryProductPrice = useMemo(() => {
    return part3Data[selectedCountry];
  }, [selectedCountry]);

  const selectedCountryCurrencySymbol = useMemo(() => {
    return countryMap.get(selectedCountry)?.currency.symbol;
  }, [countryMap, selectedCountry]);

  return (
    <main className="h-full overflow-y-auto">
      <AlertDialogTitle className="h-10 flex justify-center items-center border-b">
        Summary New Product
      </AlertDialogTitle>

      {/* MARK: PRODUCT DETAILS */}
      <div className="p-4 space-y-2 text-sm border-b">
        <p className="text-center font-semibold underline underline-offset-4 text-base">
          Product Details
        </p>
        {selectedImage && (
          <div className="w-[400px]">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt={part1Data.title}
              className="w-full object-cover rounded"
            />
          </div>
        )}
        <div className="flex gap-1">
          <p className="font-semibold tracking-wider whitespace-nowrap w-24 shrink-0">
            Title :
          </p>
          <p>{part1Data.title}</p>
        </div>
        <div className="flex gap-1">
          <p className="font-semibold tracking-wider whitespace-nowrap w-24 shrink-0">
            Description :
          </p>
          <p>{part1Data.description}</p>
        </div>
        <div className="flex gap-1">
          <p className="font-semibold tracking-wider w-24 shrink-0">
            Category :
          </p>
          <p>{findCategory?.title}</p>
        </div>
        <div className="flex gap-1">
          <p className="font-semibold tracking-wider w-24 shrink-0">
            Delivery In :
          </p>
          <p>{part1Data.deliveredBy} days</p>
        </div>
      </div>

      {/* MARK: PRODUCT STOCK */}
      <div className="p-4 space-y-2 text-sm border-b">
        <p className="text-center font-semibold underline underline-offset-4 text-base">
          Product Stock
        </p>
        <div className="flex gap-1">
          <p className="font-semibold tracking-wider w-24 shrink-0">Stock :</p>
          <p>{part2Data}</p>
        </div>
      </div>

      {/* MARK: PRODUCT PRICE */}
      <div className="p-4 py-10 space-y-5 text-sm border-b">
        <p className="text-center font-semibold underline underline-offset-4 text-base">
          Product Price
        </p>
        <div>
          <div className="flex gap-1">
            <p className="font-semibold tracking-wider w-32 shrink-0">
              Base Country :
            </p>
            <p>{country}</p>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex gap-1">
              <p className="font-semibold tracking-wider w-32 shrink-0">
                Currency Code :
              </p>
              <p>{currency_code}</p>
            </div>
            <div className="flex gap-1">
              <p className="font-semibold tracking-wider w-32 shrink-0">
                Currency Name :
              </p>
              <p>{currency_name}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div className="flex gap-1">
            <p className="font-semibold tracking-wider w-32 shrink-0">
              Price :
            </p>
            <p>
              {baseCountryCurrencySymbol} {baseCountryProductPriceObj.price}
            </p>
          </div>
          <div className="flex gap-1">
            <p className="font-semibold tracking-wider w-36 shrink-0">
              Discount (%) :
            </p>
            <p>{baseCountryProductPriceObj.discountPercentage}</p>
          </div>
          <div className="flex gap-1">
            <p className="font-semibold tracking-wider w-32 shrink-0">
              Final Price :
            </p>
            <p>
              {baseCountryCurrencySymbol}{" "}
              {baseCountryProductPriceObj.discountedPrice}
            </p>
          </div>
          <div className="flex gap-1">
            <p className="font-semibold tracking-wider w-36 shrink-0">
              Delivery Charge :
            </p>
            <p>
              {baseCountryCurrencySymbol}{" "}
              {baseCountryProductPriceObj.deliveryCharge}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Select
            value={selectedCountry}
            onValueChange={(value) => setSelectedCountry(value)}
          >
            <SelectTrigger className="capitalize">
              <SelectValue placeholder="--select-category" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => {
                return (
                  <SelectItem
                    key={country._id}
                    value={country._id}
                    className="capitalize"
                  >
                    {country.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <div>
            <div className="text-sm text-blue-500 font-semibold">
              1 {currency_code} = {part3Data[selectedCountry].exchangeRate}{" "}
              {part3Data[selectedCountry].currency_code}
            </div>
            <div className="flex gap-1">
              <p className="font-semibold tracking-wider w-36 shrink-0">
                Price :
              </p>
              <p>
                {selectedCountryCurrencySymbol}{" "}
                {selectedCountryProductPrice.price}
              </p>
            </div>
            <div className="flex gap-1">
              <p className="font-semibold tracking-wider w-36 shrink-0">
                Discount (%) :
              </p>
              <p>{selectedCountryProductPrice.discountPercentage}</p>
            </div>
            <div className="flex gap-1">
              <p className="font-semibold tracking-wider w-36 shrink-0">
                Final Price :
              </p>
              <p>
                {selectedCountryCurrencySymbol}{" "}
                {selectedCountryProductPrice.discountedPrice}
              </p>
            </div>
            <div className="flex gap-1">
              <p className="font-semibold tracking-wider w-36 shrink-0">
                Delivery Charge :
              </p>
              <p>
                {selectedCountryCurrencySymbol}{" "}
                {selectedCountryProductPrice.deliveryCharge}
              </p>
            </div>
          </div>
        </div>
      </div>
      <AlertDialogFooter className="flex p-2 items-center">
        <AlertDialogCancel ref={closeRef} className="hidden">
          Cancel
        </AlertDialogCancel>
        <AlertDialogCancel
          className="w-full"
          onClick={(e) => {
            e.preventDefault();
            setStage("part3");
          }}
        >
          Cancel
        </AlertDialogCancel>

        <Button
          className="w-full"
          type="submit"
          disabled={isPending}
          onClick={() => onSubmit()}
        >
          {isPending ? <Loading height={"full"} small={true} /> : "Submit"}
        </Button>
      </AlertDialogFooter>
    </main>
  );
};

export default Part4;
