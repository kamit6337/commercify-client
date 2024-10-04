import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postReq } from "../../../utils/api/api";
import Toastify from "../../../lib/Toastify";

const useUserAddressCreated = () => {
  const queryClient = useQueryClient();
  const { showErrorMessage } = Toastify();

  const mutation = useMutation({
    mutationKey: ["new user address"],
    mutationFn: ({ postData }) => postReq("/address", postData),
    onMutate: async (variables) => {
      const { postData } = variables;

      const newAddress = {
        _id: Date.now().toString(),
        ...postData,
      };

      await queryClient.cancelQueries({
        queryKey: ["user addresses"],
        exact: true,
      });

      const previousAddress = JSON.parse(
        JSON.stringify(queryClient.getQueryData(["user addresses"]))
      );

      queryClient.setQueryData(["user addresses"], (old = []) => {
        return [newAddress, ...old];
      });

      return { previousAddress, newAddressId: newAddress._id };
    },
    onSuccess: (data, variables, context) => {
      const { newAddressId } = context;

      queryClient.setQueryData(["user addresses"], (old = []) => {
        const modify = old.map((address) => {
          return address._id === newAddressId ? data : address;
        });
        return modify;
      });
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

export default useUserAddressCreated;
