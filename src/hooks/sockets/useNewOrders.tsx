import { BUY } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Socket } from "socket.io-client";

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

const useNewOrders = (socket: Socket) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleNewOrders = (data: BUY) => {
      const newBuy = data;

      const checkStatus = queryClient.getQueryState(["all ordered"]);
      const checkCountStatus = queryClient.getQueryState([
        "admin count details",
      ]);

      const checkAllUndeliveredStatus = queryClient.getQueryState([
        "all undelivered",
      ]);

      if (checkStatus?.status === "success") {
        queryClient.setQueryData(["all ordered"], (old: OLD) => {
          const modifyPages = old.pages.map((page) => [...page]);

          modifyPages[0] = [newBuy, ...modifyPages[0]];

          return { ...old, pages: modifyPages };
        });
      }

      if (checkAllUndeliveredStatus?.status === "success") {
        queryClient.setQueryData(["all undelivered"], (old: OLD) => {
          const modifyPages = old.pages.map((page) => [...page]);

          modifyPages[0] = [newBuy, ...modifyPages[0]];

          return { ...old, pages: modifyPages };
        });
      }

      if (checkCountStatus?.status === "success") {
        queryClient.setQueryData(["admin count details"], (old: COUNT_OLD) => {
          return {
            ...old,
            ordered: old.ordered + 1,
            undelivered: old.undelivered + 1,
          };
        });
      }
    };

    socket.on("new-orders", handleNewOrders);

    return () => {
      socket.off("new-orders", handleNewOrders);
    };
  }, [socket, queryClient]);
};

export default useNewOrders;
