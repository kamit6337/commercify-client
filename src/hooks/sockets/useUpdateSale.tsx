import { updateSale } from "@/redux/slice/saleAndStockSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Socket } from "socket.io-client";

type DATA = {
  productId: string;
  isReadyToSale: boolean;
};

const useUpdateSale = (socket: Socket) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;

    const handleUpdateSale = (data: DATA) => {
      console.log("update-sale", data);

      dispatch(updateSale(data));
    };

    socket.on("update-sale", handleUpdateSale);

    return () => {
      socket.off("update-sale", handleUpdateSale);
    };
  }, [socket]);

  return <div>useUpdateSale</div>;
};

export default useUpdateSale;
