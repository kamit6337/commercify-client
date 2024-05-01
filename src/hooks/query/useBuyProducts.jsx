import { useQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addNewOrders } from "../../redux/slice/userOrdersSlice";

const useBuyProducts = () => {
  const dispatch = useDispatch();
  const query = useQuery({
    queryKey: ["Buy Products"],
    queryFn: () =>
      getReq("/payment/success", {
        products: JSON.parse(localStorage.getItem("_cart")),
        address: localStorage.getItem("_add"),
        exchangeRate: localStorage.getItem("_exra"),
      }),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (query.isSuccess) {
      const newBuys = query.data.data;
      console.log("new buys", newBuys);

      dispatch(addNewOrders(newBuys));
    }
  }, [query, dispatch]);

  return query;
};

export default useBuyProducts;
