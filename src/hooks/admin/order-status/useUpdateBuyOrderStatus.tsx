import Toastify from "@/lib/Toastify";
import { BUY } from "@/types";
import { patchReq } from "@/utils/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type OBJ = {
  id: string;
};

type OLD = {
  pages: BUY[][];
};

type COUNT_OLD = {
  ordered: number;
  undelivered: number;
  delivered: number;
  cancelled: number;
  returned: number;
};

const useUpdateBuyOrderStatus = (buyId: string) => {
  const queryClient = useQueryClient();
  const { showErrorMessage } = Toastify();

  const mutation = useMutation({
    mutationKey: ["click to deliver", buyId],
    mutationFn: (obj: OBJ) => patchReq("/admin/order-status/deliver", obj),
    async onSuccess(data, variables, context) {
      const updateBuy = data as BUY;

      await queryClient.cancelQueries({
        queryKey: ["all ordered"],
        exact: true,
      });

      await queryClient.cancelQueries({
        queryKey: ["admin count details"],
        exact: true,
      });

      const checkStatus = queryClient.getQueryState(["all ordered"]);
      const checkCountStatus = queryClient.getQueryState([
        "admin count details",
      ]);

      if (checkStatus?.status === "success") {
        queryClient.setQueryData(["all ordered"], (old: OLD) => {
          const modifyPages = old.pages.map((page) =>
            page.map((buy) => (buy._id === updateBuy._id ? updateBuy : buy))
          );

          return { ...old, pages: modifyPages };
        });
      }

      if (checkCountStatus?.status === "success") {
        queryClient.setQueryData(["admin count details"], (old: COUNT_OLD) => {
          return {
            ...old,
            undelivered: old.undelivered - 1,
            delivered: old.delivered + 1,
          };
        });
      }
    },
    onError(error, variables, context) {
      showErrorMessage({ message: error.message });
    },
  });

  return mutation;
};

export default useUpdateBuyOrderStatus;
