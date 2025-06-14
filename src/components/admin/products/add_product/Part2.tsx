import {
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Toastify from "@/lib/Toastify";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type PARTS = "part1" | "part2" | "part3";

type Props = {
  part2Data: number;
  setPart2Data: (value: number) => void;
  setStage: (value: PARTS) => void;
};

type FormDataType = {
  stock: string;
};

const Part2 = ({ setPart2Data, setStage, part2Data }: Props) => {
  const { showAlertMessage } = Toastify();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      stock: "",
    },
  });

  useEffect(() => {
    reset({
      stock: part2Data.toString(),
    });
  }, []);

  const onSubmit = async (data: FormDataType) => {
    const stock = data.stock;

    if (!stock) {
      showAlertMessage({ message: "Please fill product stock" });
      return;
    }

    if (parseFloat(stock) === 0) {
      showAlertMessage({ message: "Stock of product is choosen 0" });
    }

    setPart2Data(parseFloat(stock));
    setStage("part3");
  };

  return (
    <main className="p-4 h-full flex flex-col gap-5">
      <AlertDialogTitle>Add Product Stock</AlertDialogTitle>

      <form
        className="flex-1 flex flex-col justify-between gap-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* MARK: STOCK */}
        <div>
          <p className="font-semibold ml-1">Current Product Stock</p>
          <div className="border rounded">
            <input
              {...register("stock", {
                required: "Please provide stock",
                pattern: {
                  value: /^\d+$/,
                  message: "Only numeric values are allowed",
                },
                min: {
                  value: 0,
                  message: "Stock cannot be less than 0",
                },
                max: {
                  value: 100,
                  message: "Stock cannot be more than 100",
                },
              })}
              className="w-full p-2"
              autoComplete="off"
              spellCheck="false"
            />
          </div>
          <p className="h-1 text-red-500 text-xs">{errors?.stock?.message}</p>
        </div>

        {/* MARK: SUBMIT AND CANCEL BUTTON */}
        <AlertDialogFooter className="grid grid-cols-2 gap-x-2">
          <Button
            className="bg-background border text-foreground hover:bg-sky-50/50"
            type="button"
            onClick={() => setStage("part1")}
          >
            Back
          </Button>
          <Button type="submit">Next</Button>
        </AlertDialogFooter>
      </form>
    </main>
  );
};

export default Part2;
