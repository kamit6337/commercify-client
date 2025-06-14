import Toastify from "@/lib/Toastify";
import { ADD_CATEGORY, CATEGORY } from "@/types";
import { postReq } from "@/utils/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type CATEGORY_PRODUCT = {
  _id: string;
  title: string;
  counts: number;
};

type OLD_COUNT = CATEGORY_PRODUCT[];

const useAddNewCategory = () => {
  const { showErrorMessage } = Toastify();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["add new category"],
    mutationFn: (obj: ADD_CATEGORY) => postReq("/admin/category", obj),
    async onSuccess(data) {
      const newCategory = data as CATEGORY;

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
          return [newCategory, ...old];
        });
      }

      if (checkCountStatus?.status === "success") {
        queryClient.setQueryData(
          ["products count details"],
          (old: OLD_COUNT) => {
            const newCount = {
              _id: newCategory._id,
              title: newCategory.title,
              counts: 0,
            };

            const modifyCategoryProducts = [newCount, ...old];

            return modifyCategoryProducts;
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

export default useAddNewCategory;
