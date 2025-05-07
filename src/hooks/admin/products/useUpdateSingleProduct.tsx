import Toastify from "@/lib/Toastify";
import { PRODUCT } from "@/types";
import { patchReq } from "@/utils/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type OLD = {
  pages: PRODUCT[][];
};

const useUpdateSingleProduct = (productId: string) => {
  const { showErrorMessage } = Toastify();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["update product", productId],
    mutationFn: (obj: PRODUCT) => patchReq("/admin/products", obj),
    async onSuccess(data: PRODUCT, variables, context) {
      const modifyProduct = data;

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
          const modifyPages = old.pages.map((page) =>
            page.map((product) =>
              product._id === modifyProduct._id ? modifyProduct : product
            )
          );

          return { ...old, pages: modifyPages };
        });
      }

      if (checkCategoryProductsStatus?.status === "success") {
        queryClient.setQueryData(
          ["Category Products", data.category?.toString()],
          (old: OLD) => {
            const modifyPages = old.pages.map((page) =>
              page.map((product) =>
                product._id === modifyProduct._id ? modifyProduct : product
              )
            );

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

export default useUpdateSingleProduct;
