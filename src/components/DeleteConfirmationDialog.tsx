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
  mutate: () => void;
  isPending: boolean;
  content: string;
};

const DeleteConfirmationDialog = ({ mutate, isPending, content }: Props) => {
  const ref = useRef<HTMLButtonElement>(null);

  const handlDelete = () => {
    mutate();

    ref.current?.click();
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>{content}</AlertDialogDescription>
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
