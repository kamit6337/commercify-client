import { useNavigate } from "react-router-dom";
import useLoginCheck from "../../hooks/auth/useLoginCheck";
import { REVIEW } from "@/types";
import Icons from "@/assets/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import useDeleteRating from "@/hooks/ratings/useDeleteRating";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";

type Props = {
  review: REVIEW;
  productId: string;
};

const SingleRating = ({ review, productId }: Props) => {
  const navigate = useNavigate();
  const { data: user } = useLoginCheck();
  const {
    _id,
    title,
    comment,
    rate,
    user: { _id: userId, name, photo },
  } = review;

  const { mutate, isPending } = useDeleteRating(_id, productId);

  return (
    <div className="space-y-3 border-b last:border-none p-5">
      {/* MARK: FIRST LINE */}
      <div className="flex justify-between items-center">
        <div className="flex gap-5 ">
          <div
            className={`${
              rate <= 2 ? "bg-red-500" : "bg-green-600"
            } flex items-center  text-white text-xs px-1 rounded`}
          >
            <p>{rate}</p>
            <Icons.star className="" />
          </div>
          <p>{title}</p>
        </div>
        <AlertDialog>
          <DropdownMenu>
            {userId === user._id && (
              <DropdownMenuTrigger>
                <Icons.options />
              </DropdownMenuTrigger>
            )}
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() =>
                  navigate(`/ratings/update?rating=${_id}&product=${productId}`)
                }
              >
                Update
              </DropdownMenuItem>
              <AlertDialogTrigger>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DeleteConfirmationDialog
            mutate={mutate}
            isPending={isPending}
            content={`This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.`}
          />
        </AlertDialog>
      </div>

      <p>{comment}</p>
      <div className="flex items-center gap-2 pt-5 text-xs">
        <p className="w-6">
          <img
            src={photo}
            alt={name}
            className="w-full object-cover rounded-full"
          />
        </p>
        <p>{name}</p>
      </div>
    </div>
  );
};

export default SingleRating;
