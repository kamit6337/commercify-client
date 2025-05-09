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
    async onSuccess(data) {
      const updateBuy = data as BUY;

      await queryClient.cancelQueries({
        queryKey: ["buy products of user"],
        exact: true,
      });

      const checkState = queryClient.getQueryState(["buy products of user"]);

      if (checkState?.status === "success") {
        queryClient.setQueryData(["buy products of user"], (old: OLD) => {
          const modifyBuy = old.pages.map((page) =>
            page.map((buy) => (buy._id === updateBuy._id ? updateBuy : buy))
          );

          return { ...old, pages: modifyBuy };
        });
      }
    },
    onError: (error) => {
      showErrorMessage({ message: error.message });
    },
  });

  return mutation;
};

export default useOrderCancel;
