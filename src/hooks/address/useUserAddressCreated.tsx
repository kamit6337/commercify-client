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
    onMutate: async (variables) => {
      const newAddress = variables;

      await queryClient.cancelQueries({
        queryKey: ["user addresses"],
        exact: true,
      });

      const previousAddress = JSON.parse(
        JSON.stringify(queryClient.getQueryData(["user addresses"]) || [])
      );

      const checkState = queryClient.getQueryState(["user addresses"]);

      if (checkState?.status === "success") {
        queryClient.setQueryData(["user addresses"], (old: ADDRESS[] = []) => {
          return [newAddress, ...old];
        });
      }

      return { previousAddress, newAddressId: newAddress._id };
    },
    onSuccess: (data, variables, context) => {
      const { newAddressId } = context;

      queryClient.setQueryData(["user addresses"], (old: ADDRESS[] = []) => {
        const modify = old.map((address) => {
          return address._id === newAddressId ? data : address;
        });
        return modify;
      });
    },
    onError: (error, variables, context) => {
      const checkState = queryClient.getQueryState(["user addresses"]);

      if (checkState) {
        queryClient.setQueryData(["user addresses"], context?.previousAddress);
      }

      showErrorMessage({ message: error.message });
    },
  });

  return mutation;
};

export default useUserAddressCreated;
