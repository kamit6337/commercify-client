import { BUY } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Socket } from "socket.io-client";

type OLD = {
  pages: BUY[][];
};

const useUpdateDeliver = (socket: Socket) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleUpdateDeliver = (data: BUY) => {
      const updateBuy = data as BUY;

      console.log("updateBuy", updateBuy);

      const checkStatus = queryClient.getQueryState(["buy products of user"]);

      if (checkStatus?.status === "success") {
        queryClient.setQueryData(["buy products of user"], (old: OLD) => {
          const modifyPages = old.pages.map((page) =>
            page.map((buy) => {
              if (buy._id === updateBuy._id) {
                return {
                  ...buy,
                  isDelivered: true,
                  deliveredDate: updateBuy.deliveredDate,
                };
              }

              return buy;
            })
          );

          return { ...old, pages: modifyPages };
        });
      }
    };

    socket.on("update-deliver", handleUpdateDeliver);

    return () => {
      socket.off("update-deliver", handleUpdateDeliver);
    };
  }, [socket]);
};

export default useUpdateDeliver;
