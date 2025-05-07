import useAddAndUpdateProduct from "@/hooks/sockets/useAddAndUpdateProduct";
import useNewOrders from "@/hooks/sockets/useNewOrders";
import getSocket from "@/lib/socketConnection";
import React from "react";

const SocketProviders = ({ children }: { children: React.ReactNode }) => {
  const socket = getSocket();

  useAddAndUpdateProduct(socket);
  useNewOrders(socket);

  return <>{children}</>;
};

export default SocketProviders;
