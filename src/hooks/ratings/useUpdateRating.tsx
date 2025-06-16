import Toastify from "@/lib/Toastify";
import { BUY, REVIEW } from "@/types";
import { patchReq } from "@/utils/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type OLD = {
  pages: REVIEW[][];
};

type OLD_BUY = {
  pages: BUY[][];
};

type SEND_OBJ = {
  _id: string;
  rate: number;
  title: string;
  comment: string;
};

const useUpdateRating = (
  productId: string,
  ratingId: string,
  buyId: string
) => {
  const queryClient = useQueryClient();
  const { showErrorMessage } = Toastify();

  const mutation = useMutation({
    mutationKey: ["update product rating", ratingId],
    mutationFn: (obj: SEND_OBJ) => patchReq("/ratings", obj),
    async onSuccess(data) {
      const updatedRating = data as REVIEW;

      await queryClient.cancelQueries({
        queryKey: ["Product Rating", productId],
      });

      await queryClient.cancelQueries({
        queryKey: ["buy products of user"],
      });

      const checkState = queryClient.getQueryState([
        "Product Rating",
        productId,
      ]);

      if (checkState) {
        queryClient.setQueryData(["Product Rating", productId], (old: OLD) => {
          const modifyPages = old.pages.map((page) =>
            page.map((rating) => {
              if (rating._id === ratingId) {
                return updatedRating;
              }

              return rating;
            })
          );

          return { ...old, pages: modifyPages };
        });
      }

      const checkBuyStatus = queryClient.getQueryState([
        "buy products of user",
      ]);

      if (checkBuyStatus?.status === "success") {
        queryClient.setQueryData(["buy products of user"], (old: OLD_BUY) => {
          const modifyPages = old.pages.map((page) =>
            page.map((buy) => {
              const modifyRating = {
                ...updatedRating,
                user: updatedRating.user._id,
              };

              if (buy._id === buyId) {
                return { ...buy, rating: modifyRating };
              }

              return buy;
            })
          );

          return { ...old, pages: modifyPages };
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
