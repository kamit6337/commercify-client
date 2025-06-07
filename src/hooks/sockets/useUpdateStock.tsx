import { updateStock } from "@/redux/slice/saleAndStockSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Socket } from "socket.io-client";

type STOCK = {
  product: string;
  stock: number;
};

const useUpdateStock = (socket: Socket) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;

    const handleUpdateStock = (data: STOCK[]) => {
      console.log("update stocks", data);

      dispatch(updateStock(data));
    };

    socket.on("update-stocks", handleUpdateStock);

    return () => {
      socket.off("update-stocks", handleUpdateStock);
    };
  }, [socket]);
};

export default useUpdateStock;
