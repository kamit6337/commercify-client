import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Loading from "@/lib/Loading";
import Toastify from "@/lib/Toastify";
import { PRODUCT, STOCK } from "@/types";
import { patchReq } from "@/utils/api/api";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

type OLD_PRODUCTS = {
  pages: PRODUCT[][];
};

type Props = {
  product: PRODUCT;
  handleCancel?: () => void;
};

type FormDataType = {
  stock: string;
};

const UpdateStock = ({ product, handleCancel }: Props) => {
  const queryClient = useQueryClient();
  const closeRef = useRef<HTMLButtonElement>(null);
  const { showErrorMessage, showSuccessMessage, showAlertMessage } = Toastify();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      stock: "",
    },
  });

  useEffect(() => {
    if (product) {
      const { stock } = product;

      reset({ stock: stock.toString() });
    }
  }, [product._id]);

  const resetField = () => {
    reset({ stock: product.stock.toString() });
  };

  const onSubmit = async (data: FormDataType) => {
    try {
      if (product.stock.toString() === data.stock) {
        showAlertMessage({ message: "Update Stock to Submit" });
        return;
      }

      const response = (await patchReq("/admin/products/stock", {
        productId: product._id,
        stock: data.stock,
      })) as STOCK;

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
              if (product._id === response.product) {
                return { ...product, stock: response.stock };
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
    }
  };

  return (
    <AlertDialogContent className="max-h-[500px] overflow-y-auto">
      <AlertDialogTitle>Update Product Stock</AlertDialogTitle>

      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        {/* MARK: STOCK */}
        <div>
          <p className="font-semibold ml-1">Current Product Stock</p>
          <div className="border rounded">
            <input
              {...register("stock", {
                required: "Please provide stock",
                pattern: {
                  value: /^\d+$/,
                  message: "Only numeric values are allowed",
                },
                min: {
                  value: 0,
                  message: "Stock cannot be less than 0",
                },
                max: {
                  value: 100,
                  message: "Stock cannot be more than 100",
                },
              })}
              className="w-full p-2 bg-inherit"
              autoComplete="off"
              spellCheck="false"
            />
          </div>
          <p className="h-1 text-red-500 text-xs">{errors?.stock?.message}</p>
        </div>

        {/* MARK: SUBMIT AND CANCEL BUTTON */}
        <div className="space-y-3 mt-10">
          <Button type="button" className="w-full" onClick={resetField}>
            Reset
          </Button>
          <AlertDialogCancel
            ref={closeRef}
            className="w-full"
            onClick={() => (handleCancel ? handleCancel() : "")}
          >
            Cancel
          </AlertDialogCancel>
          <Button className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loading small={true} height={"full"} /> : "Submit"}
          </Button>
        </div>
      </form>
    </AlertDialogContent>
  );
};

export default UpdateStock;
