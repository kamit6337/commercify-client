import ImageCrop from "@/components/ImageCrop";
import {
  AlertDialogCancel,
  AlertDialogFooter,
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
import useAllCategory from "@/hooks/category/useAllCategory";
import Toastify from "@/lib/Toastify";
import { CATEGORY } from "@/types";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

type Part1DataType = {
  title: string;
  description: string;
  deliveredBy: number;
  category: string;
};

type PARTS = "part1" | "part2" | "part3";

type Props = {
  selectedImage: File | null;
  setSelectedImage: (value: File) => void;
  part1Data: Part1DataType;
  setPart1Data: (value: Part1DataType) => void;
  setStage: (value: PARTS) => void;
};

type FormDataType = {
  title: string;
  description: string;
};

const Part1 = ({
  selectedImage,
  setSelectedImage,
  part1Data,
  setPart1Data,
  setStage,
}: Props) => {
  const imageRef = useRef<HTMLInputElement>(null);
  const [cropImage, setCropImage] = useState<File | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedDeliveryDay, setSelectedDeliveryDay] = useState("");
  const { showAlertMessage } = Toastify();
  const { data: allCategory } = useAllCategory();
  const mainRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    reset({
      title: part1Data.title,
      description: part1Data.description,
    });

    setSelectedCategoryId(part1Data.category);
    setSelectedDeliveryDay(part1Data.deliveredBy.toString());
  }, []);

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

  const onSubmit = (data: FormDataType) => {
    console.log("selectedCategoryId", selectedCategoryId);

    if (!selectedCategoryId || selectedDeliveryDay === "" || !selectedImage) {
      showAlertMessage({ message: "Please fill all data" });
      return;
    }

    const obj = {
      title: data.title,
      description: data.description,
      deliveredBy: parseFloat(selectedDeliveryDay),
      category: selectedCategoryId,
    };

    setPart1Data(obj);
    setStage("part2");
  };

  return (
    <>
      <main ref={mainRef} className="h-full overflow-y-auto p-4 space-y-3">
        <AlertDialogTitle>Add Product</AlertDialogTitle>

        <div className="w-[400px] grow-0 shrink-0">
          {selectedImage && (
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              className="w-full object-cover rounded mb-2"
            />
          )}
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

        <form
          className="flex flex-col gap-3 text-sm"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* MARK: TITLE */}
          <div>
            <p className="font-semibold ml-1 ">Title</p>
            <div className="border rounded">
              <input
                {...register("title", {
                  required: "Please provide title",
                })}
                className="w-full p-2 bg-inherit"
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
                className="w-full p-2 resize-none bg-inherit rounded"
                rows={7}
                spellCheck="false"
                autoComplete="off"
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
          <AlertDialogFooter>
            <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
            <Button type="submit" className="w-full">
              Next
            </Button>
          </AlertDialogFooter>
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
    </>
  );
};

export default Part1;
