import { useForm } from "react-hook-form";
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import { Button } from "../../ui/button";
import Loading from "@/lib/Loading";
import { useEffect, useRef } from "react";
import useAllCategory from "@/hooks/category/useAllCategory";
import { CATEGORY } from "@/types";
import useAddNewCategory from "@/hooks/admin/category/useAddNewCategory";
import Toastify from "@/lib/Toastify";

type FormDataType = {
  title: string;
};

const AddCategory = () => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const { showSuccessMessage } = Toastify();

  const { data: allCategory } = useAllCategory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
    },
  });

  const { isPending, isSuccess, mutate } = useAddNewCategory();

  useEffect(() => {
    if (isSuccess) {
      showSuccessMessage({ message: "Category added Successfully" });
      if (closeRef?.current) {
        closeRef.current.click();
      }
    }
  }, [isSuccess]);

  const resetField = () => {
    reset({
      title: "",
    });
  };

  const onSubmit = (data: FormDataType) => {
    mutate({ title: data.title });
  };

  return (
    <AlertDialogContent>
      <AlertDialogTitle>Add New Category</AlertDialogTitle>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        {/* MARK: TITLE */}
        <div>
          <p className="font-semibold ml-1">Title</p>
          <div className="border rounded">
            <input
              {...register("title", {
                required: "Please provide title",
                validate: (value) => {
                  const findCategory = allCategory.find(
                    (category: CATEGORY) =>
                      category.title.toLowerCase() === value.toLowerCase()
                  );

                  if (findCategory) {
                    return "Category title is already present. Change it";
                  }
                  return true;
                },
              })}
              className="w-full p-2"
              spellCheck="false"
              autoComplete="off"
            />
          </div>
          <p className="h-4 text-red-500 text-xs">{errors?.title?.message}</p>
        </div>
        {/* MARK: SUBMIT AND CANCEL BUTTON */}
        <div className="space-y-3 mt-10">
          <Button type="button" className="w-full" onClick={resetField}>
            Reset
          </Button>
          <AlertDialogCancel ref={closeRef} className="w-full">
            Cancel
          </AlertDialogCancel>
          <Button className="w-full" disabled={isPending}>
            {isPending ? <Loading small={true} height={"full"} /> : "Submit"}
          </Button>
        </div>
      </form>
    </AlertDialogContent>
  );
};

export default AddCategory;
