import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NEW_REVIEW, REVIEW } from "@/types";
import Toastify from "@/lib/Toastify";
import { postReq } from "@/utils/api/api";

type OLD = {
  pages: REVIEW[][];
};

const useNewRating = (productId: string) => {
  const queryClient = useQueryClient();
  const { showErrorMessage } = Toastify();

  const mutation = useMutation({
    mutationKey: ["new product rating"],
    mutationFn: (obj: NEW_REVIEW) => postReq("/ratings", obj),
    onSuccess: async (data) => {
      const newReview = data as REVIEW;

      await queryClient.cancelQueries({
        queryKey: ["Product Rating", productId],
      });

      const checkState = queryClient.getQueryState([
        "Product Rating",
        productId,
      ]);

      if (checkState) {
        queryClient.setQueryData(["Product Rating", productId], (old: OLD) => {
          const newPages = [...old.pages];
          newPages[0] = [newReview, ...newPages[0]];
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

export default useNewRating;
