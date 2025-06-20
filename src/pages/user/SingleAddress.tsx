import { useEffect, useState } from "react";
import { ADDRESS } from "@/types";
import Icons from "@/assets/icons";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useUserAddressDelete from "@/hooks/address/useUserAddressDelete";
import NewAddressForm from "@/components/NewAddressForm";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import Toastify from "@/lib/Toastify";

type Props = {
  singleAddress: ADDRESS;
};

const SingleAddress = ({ singleAddress }: Props) => {
  const [isUpdateAddress, setIsUpdateAddress] = useState(false);
  const { showSuccessMessage } = Toastify();
  const { _id, name, mobile, country, district, state, address } =
    singleAddress;

  const { mutate, isPending, isSuccess } = useUserAddressDelete(_id);

  useEffect(() => {
    if (isSuccess) {
      showSuccessMessage({ message: "Address has been deleted successfully" });
    }
  }, [isSuccess]);

  if (isUpdateAddress) {
    return (
      <NewAddressForm
        prevAddress={singleAddress}
        handleCancel={() => setIsUpdateAddress(false)}
      />
    );
  }

  return (
    <div className="p-5 border-b-2 last:border-none flex justify-between items-start">
      <div>
        <div className="flex items-center gap-10">
          <p className="capitalize font-semibold tracking-wide">{name}</p>
          <p className="font-semibold tracking-wide">{mobile}</p>
        </div>
        <p className="mt-6 mb-2 text-sm">{address}</p>
        <div className="flex">
          <p className="text-sm capitalize">{district},</p>
          <p className="ml-2 text-sm capitalize">{state}</p>
          <p className="mx-1">-</p>
          <p className="text-sm capitalize">{country}</p>
        </div>
      </div>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Icons.options />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsUpdateAddress(true)}>
              Edit
            </DropdownMenuItem>
            <AlertDialogTrigger className="w-full">
              <DropdownMenuItem className="w-full">Delete</DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <DeleteConfirmationDialog
          mutate={mutate}
          isPending={isPending}
          content={"Once Delete this address. This cannot be undone."}
        />
      </AlertDialog>
    </div>
  );
};

export default SingleAddress;
