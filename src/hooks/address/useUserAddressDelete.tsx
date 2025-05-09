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
    async onSuccess() {
      await queryClient.cancelQueries({
        queryKey: ["user addresses"],
        exact: true,
      });

      const checkState = queryClient.getQueryState(["user addresses"]);

      if (checkState) {
        queryClient.setQueryData(["user addresses"], (old: ADDRESS[]) => {
          if (!old) return [];
          return old.filter((address) => address._id !== addressId);
        });
      }
    },
    onError: (error) => {
      showErrorMessage({ message: error.message });
    },
  });

  return mutation;
};

export default useUserAddressDelete;
