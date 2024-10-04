import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postReq } from "../../../utils/api/api";
import Toastify from "../../../lib/Toastify";
import { useNavigate } from "react-router-dom";

const useNewRating = (productId) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showErrorMessage } = Toastify();

  const mutation = useMutation({
    mutationKey: ["new product rating"],
    mutationFn: (obj) => postReq("/ratings", obj),
    onMutate: async (variables) => {
      const obj = variables;

      const newObj = {
        ...obj,
        _id: Date.now().toString(),
      };

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
          const newPages = [...old.pages];
          newPages[0] = [newObj, ...newPages[0]];
          return { ...old, pages: newPages };
        });
      }

      navigate(`/products/${productId}`);

      return { previousData, newId: newObj._id };
    },
    onSuccess: (data, variables, context) => {
      const checkState = queryClient.getQueryState([
        "Product Rating",
        productId,
      ]);

      if (checkState) {
        queryClient.setQueryData(["Product Rating", productId], (old) => {
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
