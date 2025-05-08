import useAddAndUpdateProduct from "@/hooks/sockets/useAddAndUpdateProduct";
import useCancelOrder from "@/hooks/sockets/useCancelOrder";
import useNewOrders from "@/hooks/sockets/useNewOrders";
import useReturnOrder from "@/hooks/sockets/useReturnOrder";
import useUpdateDeliver from "@/hooks/sockets/useUpdateDeliver";
import getSocket from "@/lib/socketConnection";
import React, { useEffect } from "react";

const SocketProviders = ({ children }: { children: React.ReactNode }) => {
  const socket = getSocket();

  useAddAndUpdateProduct(socket);
  useNewOrders(socket);
  useUpdateDeliver(socket);
  useReturnOrder(socket);
  useCancelOrder(socket);

  useEffect(() => {
    if (!socket) return;

    socket.emit("isConnected", "I am from Client");
  }, [socket]);

  return <>{children}</>;
};

export default SocketProviders;
