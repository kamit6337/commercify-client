import { useQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addNewOrders } from "../../redux/slice/userOrdersSlice";

const useBuyProducts = (token) => {
  const dispatch = useDispatch();
  const query = useQuery({
    queryKey: ["Buy Products"],
    queryFn: () => getReq("/payment/success", { token }),
    staleTime: Infinity,
    enabled: !!token,
  });

  useEffect(() => {
    if (query.isSuccess) {
      const newBuys = query.data.products;
      dispatch(addNewOrders(newBuys));
    }
  }, [query, dispatch]);

  return query;
};

export default useBuyProducts;
