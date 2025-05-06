import Toastify from "@/lib/Toastify";
import { CATEGORY } from "@/types";
import { patchReq } from "@/utils/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type BODY = {
  id: string;
  title: string;
};

type CATEGORY_PRODUCT = {
  _id: string;
  title: string;
  categoryProductsCount: number;
};

type OLD_COUNT = {
  categoryProducts: CATEGORY_PRODUCT[];
};

const useUpdateCategory = (categoryId: string) => {
  const { showErrorMessage } = Toastify();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["update category", categoryId],
    mutationFn: (obj: BODY) => patchReq("/admin/category", obj),
    async onSuccess(data, variables, context) {
      const updatedCategory = data as CATEGORY;

      await queryClient.cancelQueries({
        queryKey: ["All Categories"],
        exact: true,
      });

      await queryClient.cancelQueries({
        queryKey: ["products count details"],
        exact: true,
      });

      const checkStatus = queryClient.getQueryState(["All Categories"]);
      const checkCountStatus = queryClient.getQueryState([
        "products count details",
      ]);

      if (checkStatus?.status === "success") {
        queryClient.setQueryData(["All Categories"], (old: CATEGORY[] = []) => {
          const modifyCategory = old.map((category) =>
            category._id === updatedCategory._id ? updatedCategory : category
          );
          return modifyCategory;
        });
      }

      if (checkCountStatus?.status === "success") {
        queryClient.setQueryData(
          ["products count details"],
          (old: OLD_COUNT) => {
            const modifyCategoryProducts = old.categoryProducts.map((obj) => {
              if (obj._id === updatedCategory._id) {
                return { ...obj, title: updatedCategory.title };
              }
              return obj;
            });

            return { ...old, categoryProducts: modifyCategoryProducts };
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

export default useUpdateCategory;
