import { useEffect, useRef, useState } from "react";
import { AlertDialogContent } from "../../../ui/alert-dialog";
import Toastify from "@/lib/Toastify";
import useAddSingleProduct from "@/hooks/admin/products/useAddSingleProduct";
import uploadImageToCLoud from "@/lib/uploadImageToCLoud";
import Part1 from "./Part1";
import Part2 from "./Part2";
import Part3 from "./Part3";
import { ADD_PRODUCT_PRICE, COUNTRY } from "@/types";
import useAllCountry from "@/hooks/countryAndCurrency/useAllCountry";
import { useSelector } from "react-redux";
import { currencyState } from "@/redux/slice/currencySlice";
import Part4 from "./Part4";

type Part1DataType = {
  title: string;
  description: string;
  deliveredBy: number;
  category: string;
};

type PARTS = "part1" | "part2" | "part3" | "part4";

type PRODUCT_PRICE_VALUE = {
  [key: string]: ADD_PRODUCT_PRICE;
};

const AddProduct = () => {
  const { data } = useAllCountry();
  const countries = data as COUNTRY[];
  countries.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );
  const { id, currency_code } = useSelector(currencyState);
  const [stage, setStage] = useState<PARTS>("part1");
  const { showSuccessMessage, showAlertMessage, showErrorMessage } = Toastify();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [part1Data, setPart1Data] = useState<Part1DataType>({
    title: "",
    description: "",
    deliveredBy: 1,
    category: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const [part2Data, setPart2Data] = useState(0);

  const [part3Data, setPart3Data] = useState<PRODUCT_PRICE_VALUE>({
    [id]: {
      country: id,
      currency_code: currency_code,
      exchangeRate: 1,
      price: 0,
      discountPercentage: 0,
      discountedPrice: 0,
      deliveryCharge: 0,
    },
  });

  const { mutate, isPending, isSuccess } = useAddSingleProduct();

  useEffect(() => {
    if (isSuccess) {
      showSuccessMessage({ message: "Product added Successfully" });
      if (closeRef?.current) {
        closeRef.current.click();
      }
    }
  }, [isSuccess]);

  const onSubmit = async () => {
    try {
      setIsLoading(true);

      if (!selectedImage) {
        showAlertMessage({ message: "Please select image to proceed" });
        setIsLoading(false);
        return;
      }

      const thumbnail = await uploadImageToCLoud(selectedImage);

      const finalObj = {
        ...part1Data,
        thumbnail,
        stock: part2Data,
        productPrice: Object.values(part3Data),
        baseCountryId: id,
      };

      console.log("finalobj", finalObj);

      mutate(finalObj);
    } catch (error) {
      showErrorMessage({
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialogContent className="h-[550px] p-0">
      {stage === "part1" && (
        <Part1
          selectedImage={selectedImage}
          part1Data={part1Data}
          setPart1Data={setPart1Data}
          setSelectedImage={setSelectedImage}
          setStage={setStage}
        />
      )}
      {stage === "part2" && (
        <Part2
          setStage={setStage}
          part2Data={part2Data}
          setPart2Data={setPart2Data}
        />
      )}
      {stage === "part3" && (
        <Part3
          countries={countries}
          setStage={setStage}
          setPart3Data={setPart3Data}
          part3Data={part3Data}
        />
      )}
      {stage === "part4" && (
        <Part4
          selectedImage={selectedImage}
          part1Data={part1Data}
          part2Data={part2Data}
          part3Data={part3Data}
          countries={countries}
          setStage={setStage}
          onSubmit={onSubmit}
          isPending={isLoading || isPending}
          closeRef={closeRef}
        />
      )}
    </AlertDialogContent>
  );
};

export default AddProduct;
