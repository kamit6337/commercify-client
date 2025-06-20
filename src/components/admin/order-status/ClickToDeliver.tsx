import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useUpdateBuyOrderStatus from "@/hooks/admin/order-status/useUpdateBuyOrderStatus";
import Loading from "@/lib/Loading";
import Toastify from "@/lib/Toastify";
import { useEffect, useRef } from "react";

type Props = {
  buyId: string;
};

const ClickToDeliver = ({ buyId }: Props) => {
  const { isPending, isSuccess, mutate } = useUpdateBuyOrderStatus(buyId);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { showSuccessMessage } = Toastify();

  useEffect(() => {
    if (isSuccess) {
      showSuccessMessage({ message: "Product has been delivered" });
      closeRef.current?.click();
    }
  }, [isSuccess]);

  return (
    <AlertDialogContent>
      <AlertDialogTitle>Are you sure ?</AlertDialogTitle>
      You have deliver this product to its address and successfully received by
      customer.
      <AlertDialogFooter>
        <AlertDialogCancel ref={closeRef}>Cancel</AlertDialogCancel>
        <AlertDialogAction
          disabled={isPending}
          onClick={() => mutate({ id: buyId })}
        >
          {isPending ? <Loading small={true} height={"full"} /> : "Yes"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default ClickToDeliver;
