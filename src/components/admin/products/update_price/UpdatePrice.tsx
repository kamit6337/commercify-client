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
import PriceUpdatePart1 from "./PriceUpdatePart1";
import PriceConfirmPart2 from "./PriceConfirmPart2";
import Toastify from "@/lib/Toastify";
import { useQueryClient } from "@tanstack/react-query";
import { patchReq } from "@/utils/api/api";

type Props = {
  product: PRODUCT;
};

type OLD_PRODUCT = {
  pages: PRODUCT[][];
};

type PRODUCT_PRICE_VALUE = {
  [key: string]: PRODUCT_PRICE;
};

const UpdatePrice = ({ product }: Props) => {
  const queryClient = useQueryClient();
  const [stage, setStage] = useState<"part1" | "part2">("part1");
  const { data } = useAllCountry();
  const countries = data as COUNTRY[];
  countries.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );

  const countryMap = useMemo(() => {
    return new Map(countries.map((country) => [country._id, country]));
  }, [countries]);

  const [isSubmit, setIsSubmit] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [isPending, setIsPending] = useState(false);
  const { id } = useSelector(currencyState);
  const { showErrorMessage, showSuccessMessage } = Toastify();
  const [fetchCountryId, setFetchCountryId] = useState(id);

  const { isLoading, data: productPrice } = useProductPrice(
    product._id,
    fetchCountryId
  );

  const [productPriceValue, setProductPriceValue] =
    useState<PRODUCT_PRICE_VALUE>({});

  const [updatedPriceValue, setUpdatedPriceValue] =
    useState<PRODUCT_PRICE_VALUE>({});

  useEffect(() => {
    if (productPrice) {
      const key = productPrice.country as string;

      setProductPriceValue((prev) => ({
        ...prev,
        [key]: productPrice,
      }));
    }
  }, [productPrice]);

  const handleNext = () => {
    const countryIds = Object.keys(productPriceValue);

    const errorCountryNameList: string[] = [];

    countryIds.forEach((countryId) => {
      const priceObj = productPriceValue[countryId];

      const productPrice = queryClient.getQueryData([
        "product price",
        product._id,
        countryId,
      ]) as PRODUCT_PRICE;

      if (
        priceObj.price !== productPrice.price ||
        priceObj.discountPercentage !== productPrice.discountPercentage ||
        priceObj.deliveryCharge !== productPrice.deliveryCharge
      ) {
        setUpdatedPriceValue((prev) => ({
          ...prev,
          [countryId]: priceObj,
        }));
      } else {
        setUpdatedPriceValue((prev) => {
          const newObj = { ...prev };

          delete newObj[countryId];

          return newObj;
        });
      }

      if (!priceObj.errors) return;

      const errorList = Object.values(priceObj.errors);

      const filter = errorList.filter((error) => !!error);

      if (filter.length === 0) return;

      const country = countryMap.get(countryId);

      errorCountryNameList.push(country?.name || "");
    });

    if (errorCountryNameList.length === 0) {
      setStage("part2");
      return;
    }

    const errorMsg = `Error in Price for Countries. ${errorCountryNameList.join(
      ", "
    )}`;

    showErrorMessage({ message: errorMsg });
  };

  const handleSubmit = async () => {
    try {
      setIsPending(true);

      const countryIds = Object.keys(updatedPriceValue);

      if (countryIds.length === 0) {
        showErrorMessage({
          message:
            "No Price Update. Please go back and cancel or make update to submit",
        });
        return;
      }

      const allUpdatedPrice = Object.values(updatedPriceValue);

      const response = await patchReq("/products/price", {
        updates: allUpdatedPrice,
      });

      if (countryIds.includes(id)) {
        const defaultCountryProductPrice = updatedPriceValue[id];

        const checkStatus = queryClient.getQueryState(["allProducts"]);

        if (checkStatus?.status === "success") {
          queryClient.setQueryData(["allProducts"], (old: OLD_PRODUCT) => {
            const modifyPages = old.pages.map((page) =>
              page.map((oldProduct) => {
                if (oldProduct._id === product._id) {
                  return { ...oldProduct, price: defaultCountryProductPrice };
                }

                return oldProduct;
              })
            );
            return { ...old, pages: modifyPages };
          });
        }
      }

      queryClient.removeQueries({
        queryKey: ["product price", product._id],
        exact: false,
      });

      setStage("part1");
      showSuccessMessage({ message: response });
      closeRef.current?.click();
    } catch (error) {
      showErrorMessage({
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try later",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AlertDialogContent className="p-0 h-[500px] overflow-y-auto gap-0">
      {stage === "part1" && (
        <AlertDialogTitle className="h-10 flex justify-center items-center border-b">
          Update Product Price
        </AlertDialogTitle>
      )}
      {stage === "part2" && (
        <AlertDialogTitle className="h-10 flex justify-center items-center border-b">
          Updated Price Summary
        </AlertDialogTitle>
      )}

      {stage === "part1" && (
        <div className="h-[375px]">
          <PriceUpdatePart1
            countries={countries}
            productPriceValue={productPriceValue}
            setProductPriceValue={setProductPriceValue}
            isLoading={isLoading}
            setFetchCountryId={setFetchCountryId}
          />
        </div>
      )}
      {stage === "part2" && (
        <div className="h-[375px]">
          <PriceConfirmPart2
            updatedPriceValue={updatedPriceValue}
            countries={countries}
            setIsSubmit={setIsSubmit}
          />
        </div>
      )}
      <AlertDialogFooter className="h-20 flex px-2 items-center">
        <AlertDialogCancel
          ref={closeRef}
          className={`${stage === "part1" ? "flex" : "hidden"}  w-full`}
        >
          Cancel
        </AlertDialogCancel>

        {stage === "part2" && (
          <AlertDialogCancel
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
              setStage("part1");
            }}
          >
            Back
          </AlertDialogCancel>
        )}

        {stage === "part1" && (
          <Button
            disabled={isLoading}
            className="w-full"
            onClick={() => handleNext()}
          >
            Next
          </Button>
        )}
        {stage === "part2" && (
          <Button
            className="w-full"
            type="submit"
            disabled={!isSubmit || isPending}
            onClick={() => handleSubmit()}
          >
            {isPending ? <Loading small={true} height={"full"} /> : "Submit"}
          </Button>
        )}
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default UpdatePrice;
