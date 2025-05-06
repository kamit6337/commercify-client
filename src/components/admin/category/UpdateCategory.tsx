import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useUpdateCategory from "@/hooks/admin/category/useUpdateCategory";
import useAllCategory from "@/hooks/category/useAllCategory";
import Loading from "@/lib/Loading";
import Toastify from "@/lib/Toastify";
import { CATEGORY } from "@/types";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

type FormDataType = {
  title: string;
};

const UpdateCategory = () => {
  const { data: allCategory } = useAllCategory();
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);
  const { showSuccessMessage } = Toastify();

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

  useEffect(() => {
    if (selectedCategoryId) {
      const findCategory = allCategory.find(
        (category: CATEGORY) => category._id === selectedCategoryId
      ) as CATEGORY;

      if (findCategory) {
        reset({
          title: findCategory.title,
        });
      }
    }
  }, [selectedCategoryId]);

  const { isPending, isSuccess, mutate } =
    useUpdateCategory(selectedCategoryId);

  useEffect(() => {
    if (isSuccess) {
      showSuccessMessage({ message: "Category updated Successfully" });
      if (closeRef?.current) {
        closeRef.current.click();
      }
    }
  }, [isSuccess]);

  const resetField = () => {
    setSelectedCategoryId("");
    reset({
      title: "",
    });
  };

  const onSubmit = (data: FormDataType) => {
    const obj = {
      id: selectedCategoryId,
      title: data.title,
    };

    mutate(obj);
  };

  return (
    <AlertDialogContent>
      <AlertDialogTitle>Update Category</AlertDialogTitle>

      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        <Select
          value={selectedCategoryId}
          onValueChange={(value) => setSelectedCategoryId(value)}
        >
          <SelectTrigger className="w-60 capitalize">
            <SelectValue placeholder="--select-category" />
          </SelectTrigger>
          <SelectContent>
            {allCategory.map((obj: CATEGORY) => {
              const { _id, title } = obj;
              return (
                <SelectItem key={_id} value={_id} className="capitalize">
                  {title}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

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
                    return "Update Category title to submit.";
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
          <Button className="w-full">
            {isPending ? <Loading small={true} height={"full"} /> : "Submit"}
          </Button>
        </div>
      </form>
    </AlertDialogContent>
  );
};

export default UpdateCategory;
