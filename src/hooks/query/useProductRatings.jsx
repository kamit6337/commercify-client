import { useQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addNewRatings } from "../../redux/slice/ratingSlice";

const useProductRatings = (id) => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["Product Rating", id],
    queryFn: () => getReq("/ratings", { id }),
    enabled: !!id,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (query?.isSuccess) {
      dispatch(addNewRatings(query.data.data));
    }
  }, [query, dispatch]);

  return query;
};

export default useProductRatings;
