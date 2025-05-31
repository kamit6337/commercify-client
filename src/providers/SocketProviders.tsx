import useAddAndUpdateProduct from "@/hooks/sockets/useAddAndUpdateProduct";
import useUpdateDeliver from "@/hooks/sockets/useUpdateDeliver";
import getSocket from "@/lib/socketConnection";
import React, { useEffect } from "react";

const SocketProviders = ({ children }: { children: React.ReactNode }) => {
  const socket = getSocket();

  useAddAndUpdateProduct(socket);
  useUpdateDeliver(socket);

  useEffect(() => {
    if (!socket) return;

    socket.emit("isConnected", "I am from Client");
  }, [socket]);

  return <>{children}</>;
};

export default SocketProviders;
