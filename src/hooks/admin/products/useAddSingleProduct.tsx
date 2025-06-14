import Toastify from "@/lib/Toastify";
import { ADD_PRODUCT_PRICE, PRODUCT } from "@/types";
import { postReq } from "@/utils/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type OLD = {
  pages: PRODUCT[][];
};

type CATEGORY_PRODUCT = {
  _id: string;
  title: string;
  counts: number;
};

type COUNT_OLD = CATEGORY_PRODUCT[];

type ADD_NEW_PRODUCT = {
  title: string;
  description: string;
  deliveredBy: number;
  category: string;
  stock: number;
  productPrice: ADD_PRODUCT_PRICE[];
  baseCountryId: string;
};

const useAddSingleProduct = () => {
  const { showErrorMessage } = Toastify();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["add product"],
    mutationFn: (obj: ADD_NEW_PRODUCT) => postReq("/admin/products", obj),
    async onSuccess(data: PRODUCT) {
      console.log("new Product", data);

      await queryClient.cancelQueries({
        queryKey: ["allProducts"],
        exact: true,
      });

      await queryClient.cancelQueries({
        queryKey: ["Category Products", data.category?._id?.toString()],
        exact: true,
      });

      queryClient.invalidateQueries({
        queryKey: ["products count details"],
        exact: true,
      });

      const checkStatus = queryClient.getQueryState(["allProducts"]);

      const checkCategoryProductsStatus = queryClient.getQueryState([
        "Category Products",
        data.category?._id?.toString(),
      ]);

      if (checkStatus?.status === "success") {
        queryClient.setQueryData(["allProducts"], (old: OLD) => {
          const modifyPages = old.pages.map((page) => [...page]);

          modifyPages[0] = [data, ...modifyPages[0]];

          return { ...old, pages: modifyPages };
        });
      }

      if (checkCategoryProductsStatus?.status === "success") {
        queryClient.setQueryData(
          ["Category Products", data.category?._id?.toString()],
          (old: OLD) => {
            const modifyPages = old.pages.map((page) => [...page]);

            modifyPages[0] = [data, ...modifyPages[0]];

            return { ...old, pages: modifyPages };
          }
        );
      }
    },
    onError(error) {
      showErrorMessage({ message: error?.message });
    },
  });

  return mutation;
};

export default useAddSingleProduct;
