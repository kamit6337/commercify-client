import Toastify from "@/lib/Toastify";
import { REVIEW } from "@/types";
import { patchReq } from "@/utils/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type OLD = {
  pages: REVIEW[][];
};

const useUpdateRating = (productId: string, ratingId: string) => {
  const queryClient = useQueryClient();
  const { showErrorMessage } = Toastify();

  const mutation = useMutation({
    mutationKey: ["update product rating", ratingId],
    mutationFn: (obj: REVIEW) => patchReq("/ratings", obj),
    async onSuccess(data) {
      const updatedRating = data as REVIEW;

      await queryClient.cancelQueries({
        queryKey: ["Product Rating", productId],
      });

      const checkState = queryClient.getQueryState([
        "Product Rating",
        productId,
      ]);

      if (checkState) {
        queryClient.setQueryData(["Product Rating", productId], (old: OLD) => {
          let newPages = [...old.pages];

          newPages = newPages.map((page) => {
            return page.map((rating) => {
              return rating._id === updatedRating._id ? updatedRating : rating;
            });
          });

          return { ...old, pages: newPages };
        });
      }
    },
    onError: (error) => {
      showErrorMessage({ message: error.message });
    },
  });

  return mutation;
};

export default useUpdateRating;
