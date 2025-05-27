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

type Props = {
  product: PRODUCT;
  handleCancel?: () => void;
};

type FormDataType = {
  title: string;
  description: string;
  discountPercentage: string;
  price: string;
};

const UpdateProduct = ({ product, handleCancel }: Props) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState("no");
  const [selectedDeliveryDay, setSelectedDeliveryDay] = useState("");
  const { data: allCategory } = useAllCategory();
  const { showAlertMessage, showSuccessMessage, showErrorMessage } = Toastify();
  const closeRef = useRef<HTMLButtonElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    _id,
    category: { _id: categoryId },
    deliveredBy,
    description,
    title,
    discountPercentage,
    price,
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
      discountPercentage: "",
      price: "",
    },
  });

  const { mutate, isPending, isSuccess } = useUpdateSingleProduct(_id);

  useEffect(() => {
    if (product && _id) {
      reset({
        title,
        description,
        discountPercentage: discountPercentage.toString(),
        price: price.toString(),
      });

      setSelectedCategoryId(categoryId);
      setSelectedDeliveryDay(deliveredBy.toString());
    }
  }, [_id]);

  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

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
      discountPercentage: discountPercentage.toString(),
      price: price.toString(),
    });

    setSelectedImage("");
    setImageFile(null);
    setSelectedCategoryId(categoryId);
    setSelectedDeliveryDay(deliveredBy.toString());
  };

  const onSubmit = async (data: FormDataType) => {
    try {
      if (
        title === data.title &&
        description === data.description &&
        discountPercentage === parseFloat(data.discountPercentage) &&
        price === parseFloat(data.price) &&
        deliveredBy === parseFloat(selectedDeliveryDay) &&
        categoryId === selectedCategoryId &&
        !selectedImage
      ) {
        showAlertMessage({ message: "Please update data to submit" });
        return;
      }

      const getImageUrl = await uploadImageToCLoud(imageFile);

      const obj = {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        discountPercentage: parseFloat(data.discountPercentage),
        deliveredBy: parseFloat(selectedDeliveryDay),
        category: selectedCategoryId,
        thumbnail: getImageUrl,
      };

      mutate(obj);
    } catch (error) {
      showErrorMessage({
        message: error instanceof Error ? error?.message : "",
      });
    }
  };

  return (
    <AlertDialogContent className="max-h-[500px] overflow-y-auto">
      <AlertDialogTitle>Update Product</AlertDialogTitle>

      <div className="w-48 grow-0 shrink-0">
        {selectedImage ? (
          <img
            src={selectedImage}
            alt={title}
            className="w-full object-cover"
          />
        ) : (
          <img src={thumbnail} alt={title} className="w-full object-cover" />
        )}
        <p
          className="border rounded py-2 cursor-pointer hover:bg-gray-100 text-center"
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
          <Button className="w-full">
            {isPending ? <Loading small={true} height={"full"} /> : "Submit"}
          </Button>
        </div>
      </form>
    </AlertDialogContent>
  );
};

export default UpdateProduct;
