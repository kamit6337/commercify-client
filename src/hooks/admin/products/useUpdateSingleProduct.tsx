import Toastify from "@/lib/Toastify";
import { PRODUCT } from "@/types";
import { patchReq } from "@/utils/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type OLD = {
  pages: PRODUCT[][];
};

type ADD_PRODUCT = {
  _id: string;
  title: string;
  description: string;
  deliveredBy: number;
  category: string;
  thumbnail: string;
  images?: string[];
};

const useUpdateSingleProduct = (productId: string) => {
  const { showErrorMessage } = Toastify();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["update product", productId],
    mutationFn: (obj: ADD_PRODUCT) => patchReq("/admin/products", obj),
    async onSuccess(data: PRODUCT) {
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
            page.map((product) => {
              if (product._id === modifyProduct._id) {
                if (product.category._id !== modifyProduct.category._id) {
                  queryClient.invalidateQueries({
                    queryKey: ["products count details"],
                    exact: true,
                  });
                }

                return { ...product, ...modifyProduct };
              }

              return product;
            })
          );

          return { ...old, pages: modifyPages };
        });
      }

      if (checkCategoryProductsStatus?.status === "success") {
        queryClient.setQueryData(
          ["Category Products", data.category?.toString()],
          (old: OLD) => {
            const modifyPages = old.pages.map((page) =>
              page.map((product) => {
                if (product._id === modifyProduct._id) {
                  return { ...product, ...modifyProduct };
                }

                return product;
              })
            );

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

export default useUpdateSingleProduct;
