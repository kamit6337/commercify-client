import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Loading from "@/lib/Loading";
import Toastify from "@/lib/Toastify";
import { PRODUCT } from "@/types";
import { patchReq } from "@/utils/api/api";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";

type OLD_PRODUCTS = {
  pages: PRODUCT[][];
};

type Props = {
  product: PRODUCT;
};

const UpdateSale = ({ product }: Props) => {
  const queryClient = useQueryClient();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [isPending, setIsPending] = useState(false);
  const { showErrorMessage, showSuccessMessage } = Toastify();

  const isReadyToSale = product.isReadyToSale;

  const handleSubmit = async () => {
    try {
      setIsPending(true);

      const response = (await patchReq("/admin/products/sale", {
        productId: product._id,
        toggle: !isReadyToSale,
      })) as PRODUCT;

      console.log("response", response);

      await queryClient.cancelQueries({
        queryKey: ["allProducts"],
        exact: true,
      });

      const checkStatus = queryClient.getQueryState(["allProducts"]);

      if (checkStatus?.status === "success") {
        queryClient.setQueryData(["allProducts"], (old: OLD_PRODUCTS) => {
          const modifyPages = old.pages.map((page) =>
            page.map((product) => {
              if (product._id === response._id.toString()) {
                return { ...product, isReadyToSale: !isReadyToSale };
              }

              return product;
            })
          );

          return { ...old, pages: modifyPages };
        });
      }

      showSuccessMessage({ message: "Stock has been updated successfully" });
      closeRef.current?.click();
    } catch (error) {
      showErrorMessage({
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AlertDialogContent className="max-h-[500px] overflow-y-auto">
      <AlertDialogTitle>Update Product Sale</AlertDialogTitle>

      {isReadyToSale ? (
        <p>
          Are you sure, you want to stop the sale of this product immediately
        </p>
      ) : (
        <p>
          Are you sure, ready to sale this product. Please check your stock
          first.
        </p>
      )}
      <AlertDialogFooter>
        <AlertDialogCancel ref={closeRef} className="w-full">
          Cancel
        </AlertDialogCancel>
        <Button
          className="w-full"
          disabled={isPending}
          onClick={() => handleSubmit()}
        >
          {isPending ? <Loading small={true} height={"full"} /> : "Submit"}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default UpdateSale;
