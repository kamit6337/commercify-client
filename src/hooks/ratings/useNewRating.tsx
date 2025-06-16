import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BUY, NEW_REVIEW, REVIEW } from "@/types";
import Toastify from "@/lib/Toastify";
import { postReq } from "@/utils/api/api";

type OLD = {
  pages: REVIEW[][];
};

type OLD_USER_BUY = {
  pages: BUY[][];
};

const useNewRating = (productId: string, buyId: string) => {
  const queryClient = useQueryClient();
  const { showErrorMessage } = Toastify();

  const mutation = useMutation({
    mutationKey: ["new product rating", productId, buyId],
    mutationFn: (obj: NEW_REVIEW) => postReq("/ratings", obj),
    onSuccess: async (data) => {
      const response = data as REVIEW;

      await queryClient.cancelQueries({
        queryKey: ["Product Rating", productId],
        exact: true,
      });

      await queryClient.cancelQueries({
        queryKey: ["buy products of user"],
        exact: true,
      });

      const checkState = queryClient.getQueryState([
        "Product Rating",
        productId,
      ]);

      if (checkState?.status === "success") {
        queryClient.setQueryData(["Product Rating", productId], (old: OLD) => {
          const newPages = [...old.pages];
          newPages[0] = [response, ...newPages[0]];
          return { ...old, pages: newPages };
        });
      }

      const checkUserBuyStatus = queryClient.getQueryState([
        "buy products of user",
      ]);

      if (checkUserBuyStatus?.status === "success") {
        queryClient.setQueryData(
          ["buy products of user"],
          (old: OLD_USER_BUY) => {
            const modifyPages = old.pages.map((page) =>
              page.map((buy) => {
                const updateResponse = { ...response, user: response.user._id };

                if (buyId === buy._id) {
                  return { ...buy, rating: updateResponse };
                }

                return buy;
              })
            );

            return { ...old, pages: modifyPages };
          }
        );
      }
    },
    onError: (error) => {
      showErrorMessage({ message: error.message });
    },
  });

  return mutation;
};

export default useNewRating;
