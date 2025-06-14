import { AlertDialogContent } from "@/components/ui/alert-dialog";
import useAllCountry from "@/hooks/countryAndCurrency/useAllCountry";
import useProductPrice from "@/hooks/products/useProductPrice";
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

type STAGE = "part1" | "part2";

const UpdatePrice = ({ product }: Props) => {
  const queryClient = useQueryClient();
  const [stage, setStage] = useState<STAGE>("part1");
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
    <AlertDialogContent className="p-0 h-[550px] ">
      {stage === "part1" && (
        <PriceUpdatePart1
          countries={countries}
          productPriceValue={productPriceValue}
          setProductPriceValue={setProductPriceValue}
          isLoading={isLoading}
          setFetchCountryId={setFetchCountryId}
          handleNext={handleNext}
        />
      )}
      {stage === "part2" && (
        <PriceConfirmPart2
          updatedPriceValue={updatedPriceValue}
          countries={countries}
          handleSubmit={handleSubmit}
          isPending={isPending}
          closeRef={closeRef}
          setStage={setStage}
        />
      )}
    </AlertDialogContent>
  );
};

export default UpdatePrice;
