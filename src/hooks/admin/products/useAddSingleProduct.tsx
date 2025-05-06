import Toastify from "@/lib/Toastify";
import { ADD_PRODUCT, PRODUCT } from "@/types";
import { postReq } from "@/utils/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type OLD = {
  pages: PRODUCT[][];
};

const useAddSingleProduct = () => {
  const { showErrorMessage } = Toastify();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["add product"],
    mutationFn: (obj: ADD_PRODUCT) => postReq("/admin/products", obj),
    async onSuccess(data: PRODUCT, variables, context) {
      await queryClient.cancelQueries({
        queryKey: ["allProducts"],
        exact: true,
      });

      await queryClient.cancelQueries({
        queryKey: ["Category Products", data.category?.toString()],
        exact: true,
      });

      const checkStatus = queryClient.getQueryState(["allProducts"]);

      const checkCategoryProductsStatus = queryClient.getQueryState([
        "Category Products",
        data.category?.toString(),
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
          ["Category Products", data.category?.toString()],
          (old: OLD) => {
            const modifyPages = old.pages.map((page) => [...page]);

            modifyPages[0] = [data, ...modifyPages[0]];

            return { ...old, pages: modifyPages };
          }
        );
      }
    },
    onError(error, variables, context) {
      showErrorMessage({ message: error?.message });
    },
  });

  return mutation;
};

export default useAddSingleProduct;
