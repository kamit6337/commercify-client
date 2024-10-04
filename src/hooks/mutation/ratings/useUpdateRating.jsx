import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchReq } from "../../../utils/api/api";
import Toastify from "../../../lib/Toastify";

const useUpdateRating = (productId, ratingId) => {
  const queryClient = useQueryClient();
  const { showErrorMessage } = Toastify();

  const mutation = useMutation({
    mutationKey: ["update product rating", ratingId],
    mutationFn: (obj) => patchReq("/ratings", obj),
    onMutate: async (variables) => {
      const updatedRating = variables;

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
            return page.map((rating) => {
              return rating._id === updatedRating._id ? updatedRating : rating;
            });
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

export default useUpdateRating;
