import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toastify from "../../lib/Toastify";
import { patchReq } from "../../utils/api/api";

const useUserAddressUpdate = (id) => {
  const queryClient = useQueryClient();
  const { showErrorMessage } = Toastify();

  const mutation = useMutation({
    mutationKey: ["update user address", id],
    mutationFn: ({ postData }) => patchReq("/address", postData),
    onMutate: async (variables) => {
      const { postData } = variables;

      await queryClient.cancelQueries({
        queryKey: ["user addresses"],
        exact: true,
      });

      const previousAddress = JSON.parse(
        JSON.stringify(queryClient.getQueryData(["user addresses"]))
      );

      queryClient.setQueryData(["user addresses"], (old = []) => {
        const modify = old.map((address) => {
          return address._id === postData._id ? postData : address;
        });
        return modify;
      });

      return { previousAddress };
    },
    onError: (error, variables, context) => {
      if (context?.previousAddress) {
        queryClient.setQueryData(["user addresses"], context.previousAddress);
      }
      showErrorMessage({ message: error.message });
    },
  });

  return mutation;
};

export default useUserAddressUpdate;
