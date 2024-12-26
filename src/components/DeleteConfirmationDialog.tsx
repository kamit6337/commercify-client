import useDeleteRating from "@/hooks/ratings/useDeleteRating";
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "./ui/alert-dialog";
import { useRef } from "react";

type Props = {
  ratingId: string;
  productId: string;
};

const DeleteConfirmationDialog = ({ ratingId, productId }: Props) => {
  const { mutate, isPending } = useDeleteRating(ratingId, productId);
  const ref = useRef<HTMLButtonElement>(null);

  const handlDelete = () => {
    mutate();

    ref.current?.click();
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel ref={ref}>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={() => handlDelete()} disabled={isPending}>
          Continue
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default DeleteConfirmationDialog;
