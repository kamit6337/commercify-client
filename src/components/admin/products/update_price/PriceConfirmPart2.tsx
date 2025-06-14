import {
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Loading from "@/lib/Loading";
import { COUNTRY, PRODUCT_PRICE } from "@/types";
import { useMemo } from "react";
import { useInView } from "react-intersection-observer";

type PRODUCT_PRICE_VALUE = {
  [key: string]: PRODUCT_PRICE;
};

type STAGE = "part1" | "part2";

type Props = {
  updatedPriceValue: PRODUCT_PRICE_VALUE;
  countries: COUNTRY[];
  isPending: boolean;
  handleSubmit: () => void;
  setStage: (key: STAGE) => void;
  closeRef: React.RefObject<HTMLButtonElement>;
};

const PriceConfirmPart2 = ({
  updatedPriceValue,
  countries,
  isPending,
  handleSubmit,
  closeRef,
  setStage,
}: Props) => {
  const countryMap = useMemo(() => {
    return new Map(countries.map((country) => [country._id, country]));
  }, [countries]);

  const { ref, inView } = useInView();

  const countryIds = Object.keys(updatedPriceValue);

  if (countryIds.length === 0) {
    return (
      <main className="h-full flex flex-col gap-2">
        <AlertDialogTitle className="h-10 flex justify-center items-center border-b">
          Updated Price Summary
        </AlertDialogTitle>
        <div className="flex-1 flex justify-center items-center">
          <p>No Price Update</p>
          <div ref={ref} />
        </div>
        <AlertDialogFooter className="h-20 px-2 grid grid-cols-2 items-center">
          <AlertDialogCancel onClick={() => setStage("part1")}>
            Cancel
          </AlertDialogCancel>
          <Button onClick={() => setStage("part1")}>Back</Button>
        </AlertDialogFooter>
      </main>
    );
  }

  return (
    <main className="h-full overflow-y-auto">
      <AlertDialogTitle className="h-10 flex justify-center items-center border-b">
        Updated Price Summary
      </AlertDialogTitle>
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
      <AlertDialogFooter className="h-20 grid grid-cols-2 items-center px-2">
        <AlertDialogCancel ref={closeRef} className={`hidden`}>
          Cancel
        </AlertDialogCancel>
        <AlertDialogCancel
          onClick={(e) => {
            e.preventDefault();
            setStage("part1");
          }}
        >
          Back
        </AlertDialogCancel>
        <Button
          type="submit"
          disabled={!inView || isPending}
          onClick={() => handleSubmit()}
        >
          {isPending ? <Loading small={true} height={"full"} /> : "Submit"}
        </Button>
      </AlertDialogFooter>
    </main>
  );
};

export default PriceConfirmPart2;
