import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toastify from "../../../lib/Toastify";
import { deleteReq } from "../../../utils/api/api";

const useDeleteRating = (productId, ratingId) => {
  const queryClient = useQueryClient();
  const { showErrorMessage } = Toastify();

  const mutation = useMutation({
    mutationKey: ["delete product rating", ratingId],
    mutationFn: () => deleteReq("/ratings", { productId, ratingId }),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["Product Rating", productId],
      });

      const previousData = JSON.parse(
        JSON.stringify(
          queryClient.getQueryData(["Product Rating", productId]) || []
        )
      );

      const checkState = queryClient.getQueryState([
        "Product Rating",
        productId,
      ]);

      if (checkState) {
        queryClient.setQueryData(["Product Rating", productId], (old) => {
          let newPages = [...old.pages];

          newPages = newPages.map((page) => {
            return page.filter((rating) => rating._id !== ratingId);
          });

          return { ...old, pages: newPages };
        });
      }

      return { previousData };
    },
    onError: (error, variables, context) => {
      const checkState = queryClient.getQueryState([
        "Product Rating",
        productId,
      ]);

      if (checkState) {
        queryClient.setQueryData(
          ["Product Rating", productId],
          context?.previousData
        );
      }

      showErrorMessage({ message: error.message });
    },
  });

  return mutation;
};

export default useDeleteRating;
