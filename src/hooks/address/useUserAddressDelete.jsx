import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReq } from "../../../utils/api/api";
import Toastify from "../../../lib/Toastify";

const useUserAddressDelete = (addressId) => {
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
        JSON.stringify(queryClient.getQueryData(["user addresses"]))
      );

      queryClient.setQueryData(["user addresses"], (old) => {
        if (!old) return [];
        return old.filter((address) => address._id !== addressId);
      });

      return { previousAddress };
    },
    onError: (error, variable, context) => {
      if (context?.previousAddress) {
        queryClient.setQueryData(["user addresses"], context?.previousAddress);
      }
      showErrorMessage({ message: error.message });
    },
  });

  return mutation;
};

export default useUserAddressDelete;
