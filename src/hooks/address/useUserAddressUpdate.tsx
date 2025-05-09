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
    async onSuccess(data) {
      const updatedAddress = data as ADDRESS;
      await queryClient.cancelQueries({
        queryKey: ["user addresses"],
        exact: true,
      });

      const checkState = queryClient.getQueryState(["user addresses"]);

      if (checkState) {
        queryClient.setQueryData(["user addresses"], (old: ADDRESS[]) => {
          const modify = old.map((address) => {
            return address._id === updatedAddress._id
              ? updatedAddress
              : address;
          });
          return modify;
        });
      }
    },
    onError: (error) => {
      showErrorMessage({ message: error.message });
    },
  });

  return mutation;
};

export default useUserAddressUpdate;
