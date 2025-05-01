import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ADDRESS } from "@/types";
import { patchReq } from "@/utils/api/api";
import Toastify from "@/lib/Toastify";

const useUserAddressUpdate = (address: ADDRESS | null) => {
  const queryClient = useQueryClient();
  const { showErrorMessage } = Toastify();

  const mutation = useMutation({
    mutationKey: ["update user address", address?._id],
    mutationFn: (postData: ADDRESS) => patchReq("/address", postData),
    onMutate: async (variables) => {
      const postData = variables;

      await queryClient.cancelQueries({
        queryKey: ["user addresses"],
        exact: true,
      });

      const previousAddress = JSON.parse(
        JSON.stringify(queryClient.getQueryData(["user addresses"]) || [])
      );

      const checkState = queryClient.getQueryState(["user addresses"]);

      if (checkState) {
        queryClient.setQueryData(["user addresses"], (old: ADDRESS[]) => {
          const modify = old.map((address) => {
            return address._id === postData._id ? postData : address;
          });
          return modify;
        });
      }

      return { previousAddress };
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

export default useUserAddressUpdate;
