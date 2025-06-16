import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useUpdateRating from "@/hooks/ratings/useUpdateRating";
import Loading from "@/lib/Loading";
import StarRating from "@/lib/StarRating";
import Toastify from "@/lib/Toastify";
import { BUY_REVIEW } from "@/types";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  rating: BUY_REVIEW;
  buyId: string;
};

type FormDataType = {
  title: string;
  comment: string;
};

const ShowRating = ({ rating, buyId }: Props) => {
  const [isUpdate, setIsUpdate] = useState(false);
  const [starSelected, setStarSelected] = useState(0);
  const { showAlertMessage, showSuccessMessage } = Toastify();
  const { _id, rate, title, comment, product } = rating;
  const closeRef = useRef<HTMLButtonElement>(null);

  const { mutate, isPending, isSuccess } = useUpdateRating(product, _id, buyId);

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      comment: "",
    },
  });

  useEffect(() => {
    if (_id) {
      reset({
        title,
        comment,
      });

      setStarSelected(rate);
    }
  }, [_id]);

  useEffect(() => {
    if (isSuccess) {
      showSuccessMessage({ message: "Rating has been updated" });
      setIsUpdate(false);
      closeRef.current?.click();
    }
  }, [isSuccess]);

  const onSubmit = (data: FormDataType) => {
    if (starSelected === 0) {
      showAlertMessage({ message: "Please select star rating" });
      return;
    }

    const obj = {
      _id,
      rate: starSelected,
      title: data.title,
      comment: data.comment,
    };

    mutate(obj);
  };

  if (!isUpdate) {
    return (
      <AlertDialogContent>
        <AlertDialogTitle className="text-center">Your Rating</AlertDialogTitle>
        <div>
          <div>
            <StarRating rate={rate} />
          </div>
          {title && comment && (
            <div>
              <div className="flex gap-1">
                <p className="w-24 shrink-0">Title :</p>
                <p className="font-semibold">{title}</p>
              </div>
              <div className="flex gap-1">
                <p className="w-24 shrink-0">Comment :</p>
                <p className="">{comment}</p>
              </div>
            </div>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={() => setIsUpdate(true)}>Update</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    );
  }

  return (
    <AlertDialogContent>
      <AlertDialogTitle className="text-center">Update Rating</AlertDialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <StarRating
            rate={starSelected}
            isClick={true}
            onClick={(key) => setStarSelected(key)}
          />
        </div>
        <div>
          <div className="border w-full rounded">
            <input
              type="text"
              {...register("title", {
                validate: (value: string) => {
                  if (value && !getValues().comment) {
                    return "Please provide comment";
                  }
                  return true;
                },
              })}
              placeholder="Title"
              className="w-full p-2 rounded"
              autoComplete="off"
              spellCheck="false"
            />
          </div>
          <p className="text-xs text-red-500 h-4 ml-1 mt-1">
            {errors.comment?.message}
          </p>
        </div>
        <div>
          <div className="border w-full rounded">
            <textarea
              {...register("comment", {
                validate: (value: string) => {
                  if (value && !getValues().title) {
                    return "Please provide title";
                  }
                  return true;
                },
              })}
              placeholder="Comment"
              className="w-full p-2 rounded resize-none h-full"
              rows={5}
            />
          </div>
          <p className="text-xs text-red-500 h-4 ml-1 mt-1">
            {errors.title?.message}
          </p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel ref={closeRef} className="hidden">
            Cancel
          </AlertDialogCancel>
          <AlertDialogCancel
            onClick={(e) => {
              e.preventDefault();
              setIsUpdate(false);
            }}
          >
            Back
          </AlertDialogCancel>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Loading height={"full"} small={true} /> : "Submit"}
          </Button>
        </AlertDialogFooter>
      </form>
    </AlertDialogContent>
  );
};

export default ShowRating;
