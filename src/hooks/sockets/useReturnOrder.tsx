import { BUY, ORDER_STATUS_COUNT } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Socket } from "socket.io-client";

type OLD = {
  pages: BUY[][];
};

const useReturnOrder = (socket: Socket) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleOrderReturn = (data: BUY) => {
      const updateBuy = data;

      const checkCountStatus = queryClient.getQueryState([
        "admin count details",
      ]);

      if (checkCountStatus?.status === "success") {
        queryClient.setQueryData(
          ["admin count details"],
          (old: ORDER_STATUS_COUNT) => {
            return {
              ...old,
              delivered: old.delivered - 1,
              returned: old.returned + 1,
            };
          }
        );
      }
      const checkAllOrdered = queryClient.getQueryState(["all ordered"]);

      if (checkAllOrdered?.status === "success") {
        queryClient.setQueryData(["all ordered"], (old: OLD) => {
          const modifyPages = old.pages.map((page) =>
            page.map((buy) => (buy._id === updateBuy._id ? updateBuy : buy))
          );
          return { ...old, pages: modifyPages };
        });
      }

      const checkAllDelivered = queryClient.getQueryState(["all delivered"]);

      if (checkAllDelivered?.status === "success") {
        queryClient.setQueryData(["all delivered"], (old: OLD) => {
          const modifyPages = old.pages.map((page) =>
            page.filter((buy) => buy._id !== updateBuy._id)
          );
          return { ...old, pages: modifyPages };
        });
      }

      const checkAllReturned = queryClient.getQueryState(["all returned"]);

      if (checkAllReturned?.status === "success") {
        queryClient.setQueryData(["all returned"], (old: OLD) => {
          const modifyPages = old.pages.map((page) => [...page]);

          modifyPages[0] = [updateBuy, ...modifyPages[0]];

          return { ...old, pages: modifyPages };
        });
      }
    };

    socket.on("order-return", handleOrderReturn);

    return () => {
      socket.off("order-return", handleOrderReturn);
    };
  }, [socket, queryClient]);
};

export default useReturnOrder;
