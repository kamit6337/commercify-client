import { useEffect, useRef, useState } from "react";
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import useAllCategory from "@/hooks/category/useAllCategory";
import Toastify from "@/lib/Toastify";
import { useForm } from "react-hook-form";
import { CATEGORY } from "@/types";
import { Button } from "../../ui/button";
import Loading from "@/lib/Loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import useAddSingleProduct from "@/hooks/admin/products/useAddSingleProduct";
import uploadImageToCLoud from "@/lib/uploadImageToCLoud";

type FormDataType = {
  title: string;
  description: string;
  discountPercentage: string;
  price: string;
};

const AddProduct = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState("no");
  const [selectedDeliveryDay, setSelectedDeliveryDay] = useState("");
  const { data: allCategory } = useAllCategory();
  const { showAlertMessage, showSuccessMessage, showErrorMessage } = Toastify();
  const closeRef = useRef<HTMLButtonElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      discountPercentage: "",
      price: "",
    },
  });

  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  const { mutate, isPending, isSuccess } = useAddSingleProduct();

  useEffect(() => {
    if (isSuccess) {
      showSuccessMessage({ message: "Product added Successfully" });
      if (closeRef?.current) {
        closeRef.current.click();
      }
    }
  }, [isSuccess]);

  const resetField = () => {
    reset({
      title: "",
      description: "",
      discountPercentage: "",
      price: "",
    });

    setSelectedDeliveryDay("");
    setSelectedCategoryId("no");
  };

  const onSubmit = async (data: FormDataType) => {
    try {
      if (
        selectedCategoryId === "no" ||
        selectedDeliveryDay === "" ||
        selectedImage === "" ||
        imageFile === null
      ) {
        showAlertMessage({ message: "Please update data to submit" });
        return;
      }

      const getImageUrl = await uploadImageToCLoud(imageFile);

      const findCategory = allCategory.find(
        (category: CATEGORY) => category._id === selectedCategoryId
      ) as CATEGORY;

      const obj = {
        title: data.title,
        description: data.description,
        thumbnail: getImageUrl,
        price: parseFloat(data.price),
        discountPercentage: parseFloat(data.discountPercentage),
        deliveredBy: parseFloat(selectedDeliveryDay),
        category: {
          _id: findCategory._id,
          title: findCategory.title,
          createdAt: findCategory.createdAt,
          updatedAt: findCategory.updatedAt,
        },
      };

      mutate(obj);
    } catch (error) {
      showErrorMessage({
        message: error instanceof Error ? error?.message : "",
      });
    }
  };

  const isLoading = isPending || isSubmitting;

  return (
    <AlertDialogContent className="max-h-[500px] overflow-y-auto">
      <AlertDialogTitle>Add Product</AlertDialogTitle>

      <div className="w-48 grow-0 shrink-0">
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Selected"
            className="w-full object-cover rounded mb-2"
          />
        )}
        <p
          className="border rounded py-2 cursor-pointer hover:bg-gray-100 text-center"
          onClick={() => imageRef.current?.click()}
        >
          Select Image
        </p>
        <input
          ref={imageRef}
          type="file"
          accept="images/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setImageFile(file);
              const imageUrl = URL.createObjectURL(file);
              setSelectedImage(imageUrl);
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
              className="w-full p-2"
              spellCheck="false"
              autoComplete="off"
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
              className="w-full p-2 resize-none"
              rows={7}
              spellCheck="false"
              autoComplete="off"
            />
          </div>
          <p className="h-1 text-red-500 text-xs">
            {errors?.description?.message}
          </p>
        </div>

        {/* MARK: PRICE */}
        <div>
          <p className="font-semibold ml-1">Price</p>
          <div className="border rounded">
            <input
              {...register("price", {
                required: "Please provide price",
                pattern: {
                  value: /^[0-9]*\.?[0-9]*$/,
                  message: "Please enter a valid numeric value",
                },
              })}
              className="w-full p-2"
              spellCheck="false"
              autoComplete="off"
            />
          </div>
          <p className="h-1 text-red-500 text-xs">{errors?.price?.message}</p>
        </div>

        {/* MARK: DISCOUNT PERCENT */}
        <div>
          <p className="font-semibold ml-1">Discount Percent</p>
          <div className="border rounded">
            <input
              {...register("discountPercentage", {
                required: "Please provide discount percentage",
                pattern: {
                  value: /^[0-9]*\.?[0-9]*$/,
                  message: "Please enter a valid numeric value",
                },
              })}
              className="w-full p-2"
              spellCheck="false"
              autoComplete="off"
            />
          </div>
          <p className="h-1 text-red-500 text-xs">
            {errors?.discountPercentage?.message}
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
              <SelectValue placeholder="--select-delivery-day" />
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
          <AlertDialogCancel ref={closeRef} className="w-full">
            Cancel
          </AlertDialogCancel>
          <Button className="w-full" disabled={isLoading}>
            {isLoading ? <Loading small={true} height={"full"} /> : "Submit"}
          </Button>
        </div>
      </form>
    </AlertDialogContent>
  );
};

export default AddProduct;
