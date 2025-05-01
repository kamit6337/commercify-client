import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { REVIEW } from "@/types";
import Toastify from "@/lib/Toastify";
import { postReq } from "@/utils/api/api";

type OLD = {
  pages: REVIEW[][];
};

const useNewRating = (productId: string) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showErrorMessage } = Toastify();

  const mutation = useMutation({
    mutationKey: ["new product rating"],
    mutationFn: (obj: REVIEW) => postReq("/ratings", obj),
    onMutate: async (variables) => {
      const obj = variables as REVIEW;

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
          const newPages = [...old.pages];
          newPages[0] = [obj, ...newPages[0]];
          return { ...old, pages: newPages };
        });
      }

      navigate(`/products/${productId}`);

      return { previousData, newId: obj._id };
    },
    onSuccess: (data, variables, context) => {
      const checkState = queryClient.getQueryState([
        "Product Rating",
        productId,
      ]);

      if (checkState) {
        queryClient.setQueryData(["Product Rating", productId], (old: OLD) => {
          const newPages = [...old.pages];
          newPages[0] = newPages[0].map((rating) => {
            return rating._id === context?.newId ? data : rating;
          });
          return { ...old, pages: newPages };
        });
      }
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

export default useNewRating;
