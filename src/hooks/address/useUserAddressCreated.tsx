import Toastify from "@/lib/Toastify";
import { ADDRESS } from "@/types";
import { postReq } from "@/utils/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUserAddressCreated = () => {
  const queryClient = useQueryClient();
  const { showErrorMessage } = Toastify();

  const mutation = useMutation({
    mutationKey: ["new user address"],
    mutationFn: (postData: ADDRESS) => postReq("/address", postData),
    onSuccess: async (data) => {
      const newAddress = data as ADDRESS;

      await queryClient.cancelQueries({
        queryKey: ["user addresses"],
        exact: true,
      });

      const checkState = queryClient.getQueryState(["user addresses"]);

      if (checkState?.status === "success") {
        queryClient.setQueryData(["user addresses"], (old: ADDRESS[] = []) => {
          return [newAddress, ...old];
        });
      }
    },
    onError: (error) => {
      showErrorMessage({ message: error.message });
    },
  });

  return mutation;
};

export default useUserAddressCreated;
