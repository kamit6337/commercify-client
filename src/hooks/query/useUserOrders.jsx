import { useQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fillInitialOrders } from "../../redux/slice/userOrdersSlice";

const useUserOrders = (toggle = false) => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["buy products of user"],
    queryFn: () => getReq("/buy"),
    staleTime: Infinity,
    enabled: toggle,
  });

  useEffect(() => {
    if (query.isSuccess) {
      dispatch(fillInitialOrders(query.data.data));
    }
  }, [query, dispatch]);

  return query;
};

export default useUserOrders;
