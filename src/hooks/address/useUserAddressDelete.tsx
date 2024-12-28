import Toastify from "@/lib/Toastify";
import { ADDRESS } from "@/types";
import { deleteReq } from "@/utils/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUserAddressDelete = (addressId: string) => {
  const queryClient = useQueryClient();
  const { showErrorMessage } = Toastify();

  const mutation = useMutation({
    mutationKey: ["user address delete", addressId],
    mutationFn: () => deleteReq("/address", { id: addressId }),
    onMutate: async () => {
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
          if (!old) return [];
          return old.filter((address) => address._id !== addressId);
        });
      }

      return { previousAddress };
    },
    onError: (error, variable, context) => {
      const checkState = queryClient.getQueryState(["user addresses"]);

      if (checkState) {
        queryClient.setQueryData(["user addresses"], context?.previousAddress);
      }
      showErrorMessage({ message: error.message });
    },
  });

  return mutation;
};

export default useUserAddressDelete;
