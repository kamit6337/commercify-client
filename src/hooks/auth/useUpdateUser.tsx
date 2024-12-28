import Toastify from "@/lib/Toastify";
import { USER } from "@/types";
import { patchReq } from "@/utils/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { showErrorMessage } = Toastify();

  const mutation = useMutation({
    mutationKey: ["update user profile"],
    mutationFn: (obj: USER) => patchReq("/user", obj),
    onMutate: async (variables) => {
      const user = variables;
      await queryClient.cancelQueries({
        queryKey: ["login check"],
        exact: true,
      });

      const previousUser = JSON.parse(
        JSON.stringify(queryClient.getQueryData(["login check"]) || [])
      );

      const checkState = queryClient.getQueryState(["login check"]);

      if (checkState) {
        queryClient.setQueryData(["login check"], (old: USER) => {
          return { ...old, ...user };
        });
      }

      return { previousUser };
    },
    onError(error, variables, context) {
      const checkState = queryClient.getQueryState(["login check"]);

      if (checkState) {
        queryClient.setQueryData(["login check"], context?.previousUser);
      }

      showErrorMessage({ message: error.message });
    },
  });

  return mutation;
};

export default useUpdateUser;
