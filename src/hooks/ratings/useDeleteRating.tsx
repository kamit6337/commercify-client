import Toastify from "@/lib/Toastify";
import { REVIEW } from "@/types";
import { deleteReq } from "@/utils/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type OLD = {
  pages: REVIEW[][];
};

const useDeleteRating = (ratingId: string, productId: string) => {
  const queryClient = useQueryClient();
  const { showErrorMessage } = Toastify();

  const mutation = useMutation({
    mutationKey: ["delete rating", ratingId],
    mutationFn: () => deleteReq("/ratings", { productId, ratingId }),
    async onSuccess() {
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
            return page.filter((rating) => rating._id !== ratingId);
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

export default useDeleteRating;
