import Toastify from "@/lib/Toastify";
import { REVIEW } from "@/types";
import { patchReq } from "@/utils/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

type OLD = {
  pages: REVIEW[][];
};

const useUpdateRating = (productId: string, ratingId: string) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showErrorMessage } = Toastify();

  const mutation = useMutation({
    mutationKey: ["update product rating", ratingId],
    mutationFn: (obj: REVIEW) => patchReq("/ratings", obj),
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

      navigate(`/products/${productId}`);

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
