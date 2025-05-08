import Toastify from "@/lib/Toastify";
import { BUY, ORDER_STATUS_COUNT } from "@/types";
import { patchReq } from "@/utils/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type OBJ = {
  id: string;
};

type OLD = {
  pages: BUY[][];
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

      await queryClient.cancelQueries({
        queryKey: ["all undelivered"],
        exact: true,
      });

      await queryClient.cancelQueries({
        queryKey: ["all delivered"],
        exact: true,
      });

      const checkStatus = queryClient.getQueryState(["all ordered"]);
      const checkCountStatus = queryClient.getQueryState([
        "admin count details",
      ]);

      const checkAllUndeliveredStatus = queryClient.getQueryState([
        "all undelivered",
      ]);

      const checkAllDeliveredStatus = queryClient.getQueryState([
        "all delivered",
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
        queryClient.setQueryData(
          ["admin count details"],
          (old: ORDER_STATUS_COUNT) => {
            return {
              ...old,
              undelivered: old.undelivered - 1,
              delivered: old.delivered + 1,
            };
          }
        );
      }

      if (checkAllUndeliveredStatus?.status === "success") {
        queryClient.setQueryData(["all undelivered"], (old: OLD) => {
          const modifyPages = old.pages.map((page) =>
            page.filter((buy) => buy._id !== updateBuy._id)
          );

          return { ...old, pages: modifyPages };
        });
      }

      if (checkAllDeliveredStatus?.status === "success") {
        queryClient.setQueryData(["all delivered"], (old: OLD) => {
          const modifyPages = old.pages.map((page) => [...page]);

          modifyPages[0] = [updateBuy, ...modifyPages[0]];

          return { ...old, pages: modifyPages };
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
