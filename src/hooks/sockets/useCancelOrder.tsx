import { BUY, ORDER_STATUS_COUNT } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Socket } from "socket.io-client";

type OLD = {
  pages: BUY[][];
};

const useCancelOrder = (socket: Socket) => {
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
              undelivered: old.undelivered - 1,
              cancelled: old.cancelled + 1,
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

      const checkAllDelivered = queryClient.getQueryState(["all undelivered"]);

      if (checkAllDelivered?.status === "success") {
        queryClient.setQueryData(["all undelivered"], (old: OLD) => {
          const modifyPages = old.pages.map((page) =>
            page.filter((buy) => buy._id !== updateBuy._id)
          );
          return { ...old, pages: modifyPages };
        });
      }

      const checkAllReturned = queryClient.getQueryState(["all cancelled"]);

      if (checkAllReturned?.status === "success") {
        queryClient.setQueryData(["all cancelled"], (old: OLD) => {
          const modifyPages = old.pages.map((page) => [...page]);

          modifyPages[0] = [updateBuy, ...modifyPages[0]];

          return { ...old, pages: modifyPages };
        });
      }
    };

    socket.on("order-cancel", handleOrderReturn);

    return () => {
      socket.off("order-cancel", handleOrderReturn);
    };
  }, [socket, queryClient]);
};

export default useCancelOrder;
