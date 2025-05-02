import Toastify from "@/lib/Toastify";
import { BUY } from "@/types";
import { patchReq } from "@/utils/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type OLD = {
  pages: BUY[][];
  pageParams: number[];
};

const useOrderCancel = (buyId: string) => {
  const queryClient = useQueryClient();
  const { showErrorMessage } = Toastify();

  const mutation = useMutation({
    mutationKey: ["order cancel", buyId],
    mutationFn: (reason: string) =>
      patchReq("/buy/cancel", { id: buyId, reason }),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["buy products of user"],
        exact: true,
      });

      const previousData = JSON.parse(
        JSON.stringify(queryClient.getQueryData(["buy products of user"]) || [])
      ) as OLD;

      const checkState = queryClient.getQueryState(["buy products of user"]);

      if (checkState?.status === "success") {
        queryClient.setQueryData(["buy products of user"], (old: OLD) => {
          if (!old || old.pages[0].length === 0) return old;

          const modifyBuy = old.pages.map((page) =>
            page.map((buy) => {
              if (buy._id === buyId) {
                return { ...buy, isCancelled: true };
              }
              return buy;
            })
          );

          return { ...old, pages: modifyBuy };
        });
      }

      return { previousData };
    },
    onError: (error, variables, context) => {
      const checkState = queryClient.getQueryState(["buy products of user"]);

      if (checkState) {
        queryClient.setQueryData(
          ["buy products of user"],
          context?.previousData
        );
      }

      showErrorMessage({ message: error.message });
    },
  });

  return mutation;
};

export default useOrderCancel;
