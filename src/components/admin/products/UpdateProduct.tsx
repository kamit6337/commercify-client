import { CATEGORY, PRODUCT } from "@/types";
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../ui/button";
import Loading from "@/lib/Loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import useAllCategory from "@/hooks/category/useAllCategory";
import Toastify from "@/lib/Toastify";
import useUpdateSingleProduct from "@/hooks/admin/products/useUpdateSingleProduct";
import uploadImageToCLoud from "@/lib/uploadImageToCLoud";
import ImageCrop from "@/components/ImageCrop";

type Props = {
  product: PRODUCT;
  handleCancel?: () => void;
};

type FormDataType = {
  title: string;
  description: string;
};

const UpdateProduct = ({ product, handleCancel }: Props) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState("no");
  const [selectedDeliveryDay, setSelectedDeliveryDay] = useState("");
  const { data: allCategory } = useAllCategory();
  const { showAlertMessage, showSuccessMessage, showErrorMessage } = Toastify();
  const closeRef = useRef<HTMLButtonElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [cropImage, setCropImage] = useState<File | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const {
    _id,
    category: { _id: categoryId },
    deliveredBy,
    description,
    title,
    thumbnail,
  } = product;

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const { mutate, isPending, isSuccess } = useUpdateSingleProduct(_id);

  useEffect(() => {
    if (product && _id) {
      reset({
        title,
        description,
      });

      setSelectedCategoryId(categoryId);
      setSelectedDeliveryDay(deliveredBy.toString());
    }
  }, [_id]);

  useEffect(() => {
    if (isSuccess) {
      showSuccessMessage({ message: "Product updated Successfully" });
      if (closeRef?.current) {
        closeRef.current.click();
      }
    }
  }, [isSuccess]);

  const resetField = () => {
    reset({
      title,
      description,
    });

    setSelectedImage(null);
    setSelectedCategoryId(categoryId);
    setSelectedDeliveryDay(deliveredBy.toString());
  };

  const handleOnCrop = (croppedFile: File) => {
    setSelectedImage(croppedFile);
    setCropImage(null);
    if (imageRef.current) {
      imageRef.current.value = "";
    }
    // Scroll main to top after cropping
    mainRef.current?.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleCancelCrop = () => {
    setCropImage(null);

    if (imageRef.current) {
      imageRef.current.value = "";
    }
    // Scroll main to top after cropping
    mainRef.current?.scrollTo({ top: 0, behavior: "instant" });
  };

  const onSubmit = async (data: FormDataType) => {
    try {
      if (
        title === data.title &&
        description === data.description &&
        deliveredBy === parseFloat(selectedDeliveryDay) &&
        categoryId === selectedCategoryId &&
        !selectedImage
      ) {
        showAlertMessage({ message: "Please update data to submit" });
        return;
      }

      const getImageUrl = await uploadImageToCLoud(selectedImage);

      const obj = {
        _id: product._id,
        title: data.title,
        description: data.description,
        deliveredBy: parseFloat(selectedDeliveryDay),
        category: selectedCategoryId,
        thumbnail: getImageUrl || thumbnail,
      };

      mutate(obj);
    } catch (error) {
      showErrorMessage({
        message: error instanceof Error ? error?.message : "",
      });
    }
  };

  return (
    <AlertDialogContent className={`p-0 h-[550px]  `}>
      <main ref={mainRef} className="h-full overflow-y-auto p-4">
        <AlertDialogTitle>Update Product</AlertDialogTitle>

        <div className="w-[400px] grow-0 shrink-0">
          <img
            src={selectedImage ? URL.createObjectURL(selectedImage) : thumbnail}
            alt={title}
            className="w-full object-cover"
          />

          <p
            className="border rounded py-2 cursor-pointer hover:bg-gray-100 dark:hover:text-black text-center"
            onClick={() => imageRef.current?.click()}
          >
            Select Thumbnail
          </p>
          <input
            ref={imageRef}
            type="file"
            accept="images/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setCropImage(file);
              }
            }}
          />
        </div>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          {/* MARK: TITLE */}
          <div>
            <p className="font-semibold ml-1">Title</p>
            <div className="border rounded">
              <input
                {...register("title", {
                  required: "Please provide title",
                })}
                className="w-full p-2 bg-inherit"
              />
            </div>
            <p className="h-1 text-red-500 text-xs">{errors?.title?.message}</p>
          </div>

          {/* MARK: DESCRIPTION */}
          <div>
            <p className="font-semibold ml-1">Description</p>
            <div className="border rounded">
              <textarea
                {...register("description", {
                  required: "Please provide description",
                })}
                className="w-full p-2 resize-none bg-inherit"
                rows={7}
              />
            </div>
            <p className="h-1 text-red-500 text-xs">
              {errors?.description?.message}
            </p>
          </div>
          {/* MARK: CATEGORY */}
          <div className="">
            <p className="font-semibold ml-1">Category : </p>

            <Select
              value={selectedCategoryId}
              onValueChange={(value) => setSelectedCategoryId(value)}
            >
              <SelectTrigger className="w-60 capitalize">
                <SelectValue placeholder="--select-category" />
              </SelectTrigger>
              <SelectContent>
                {allCategory?.length > 0 ? (
                  allCategory.map((obj: CATEGORY) => {
                    const { _id, title } = obj;
                    return (
                      <SelectItem key={_id} value={_id} className="capitalize">
                        {title}
                      </SelectItem>
                    );
                  })
                ) : (
                  <SelectItem value={"no"}>No Category Present</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* MARK: DELIVERY BY DAYS */}
          <div>
            <p className="font-semibold ml-1">Delivery Day</p>

            <Select
              value={selectedDeliveryDay}
              onValueChange={(value) => setSelectedDeliveryDay(value)}
            >
              <SelectTrigger className="w-60 capitalize">
                <SelectValue placeholder="--select-category" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {Array.from({ length: 30 }).map((_, i) => {
                  const day = (i + 1).toString();

                  return (
                    <SelectItem key={i} value={day} className="capitalize">
                      {day}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* MARK: SUBMIT AND CANCEL BUTTON */}
          <div className="space-y-3 mt-10">
            <Button type="button" className="w-full" onClick={resetField}>
              Reset
            </Button>
            <AlertDialogCancel
              ref={closeRef}
              className="w-full"
              onClick={() => (handleCancel ? handleCancel() : "")}
            >
              Cancel
            </AlertDialogCancel>
            <Button className="w-full" disabled={isPending}>
              {isPending ? <Loading small={true} height={"full"} /> : "Submit"}
            </Button>
          </div>
        </form>
      </main>

      {cropImage ? (
        <ImageCrop
          image={cropImage}
          onCrop={handleOnCrop}
          cancelCrop={handleCancelCrop}
        />
      ) : (
        ""
      )}
    </AlertDialogContent>
  );
};

export default UpdateProduct;
