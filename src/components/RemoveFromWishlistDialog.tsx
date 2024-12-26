import { useDispatch } from "react-redux";
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
} from "./ui/alert-dialog";
import { updateWishlist } from "@/redux/slice/cartAndWishlistSlice";
import { useRef } from "react";

type Props = {
  productId: string;
};

const RemoveFromWishlistDialog = ({ productId }: Props) => {
  const dispatch = useDispatch();
  const ref = useRef<HTMLButtonElement>(null);

  const removeFromWatchlist = () => {
    dispatch(updateWishlist({ id: productId, add: false }));
    ref.current?.click();
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          You really want to remove this product from Wishlist
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel ref={ref}>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={() => removeFromWatchlist()}>
          Remove
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default RemoveFromWishlistDialog;
