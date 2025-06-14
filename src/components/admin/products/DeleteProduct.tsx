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
import { deleteReq } from "@/utils/api/api";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";

type Props = {
  product: PRODUCT;
};

type OLD_PRODUCTS = {
  pages: PRODUCT[][];
};

const DeleteProduct = ({ product }: Props) => {
  const queryClient = useQueryClient();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [isPending, setIsPending] = useState(false);
  const { showErrorMessage, showSuccessMessage } = Toastify();

  const handleSubmit = async () => {
    try {
      setIsPending(true);

      const response = await deleteReq("/admin/products", {
        productId: product._id,
      });

      showSuccessMessage({ message: response });

      await queryClient.cancelQueries({
        queryKey: ["allProducts"],
        exact: true,
      });

      const checkAllProductsStatus = queryClient.getQueryState(["allProducts"]);

      if (checkAllProductsStatus?.status === "success") {
        queryClient.setQueryData(["allProducts"], (old: OLD_PRODUCTS) => {
          const modifyPages = old.pages.map((page) =>
            page.filter((prevProduct) => prevProduct._id !== product._id)
          );
          return { ...old, pages: modifyPages };
        });
      }

      await queryClient.cancelQueries({
        queryKey: ["Category Products", product.category._id],
        exact: true,
      });

      const checkCategoryProductStatus = queryClient.getQueryState([
        "Category Products",
        product.category._id,
      ]);

      if (checkCategoryProductStatus?.status === "success") {
        queryClient.setQueryData(
          ["Category Products", product.category._id],
          (old: OLD_PRODUCTS) => {
            const modifyPages = old.pages.map((page) =>
              page.filter((prevProduct) => prevProduct._id !== product._id)
            );
            return { ...old, pages: modifyPages };
          }
        );
      }

      queryClient.invalidateQueries({
        queryKey: ["products count details"],
        exact: true,
      });

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
      <AlertDialogTitle>Delete Product</AlertDialogTitle>
      <div className="text-red-500 space-y-3">
        <p>
          Along with Product, its Stock and its Prices will also be deleted
          permanently.
        </p>
        <p className="font-semibold tracking-wide">
          Are you sure to delete this product ?
        </p>
      </div>
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

export default DeleteProduct;
