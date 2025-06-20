import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import makeDateFromUTC from "../../utils/javascript/makeDateFromUTC";
import useSingleBuy from "@/hooks/buys/useSingleBuy";
import Loading from "@/lib/Loading";
import useOrderCancel from "@/hooks/orders/useOrderCancel";
import Toastify from "@/lib/Toastify";
import { BUY } from "@/types";

type Params = {
  buyId: string;
};

type FormType = {
  reason: string;
};

const OrderCancel = () => {
  const navigate = useNavigate();
  const { buyId } = useParams() as Params;
  const { showSuccessMessage } = Toastify();
  const { isLoading, error, data: buyProduct } = useSingleBuy(buyId);
  const { mutate, isPending, isSuccess } = useOrderCancel(buyId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    defaultValues: {
      reason: "",
    },
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [buyId]);

  useEffect(() => {
    if (isSuccess) {
      showSuccessMessage({ message: "Order cancelled successfully" });
      navigate("/user/orders");
    }
  }, [isSuccess, navigate]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  if (!buyProduct) {
    return (
      <div>
        <p>Error occur</p>
      </div>
    );
  }

  const {
    product,
    buyPrice,
    quantity,
    address: buyAddress,
    isDelivered,
    deliveredDate,
    createdAt,
    country: {
      currency: { symbol },
    },
  } = buyProduct as BUY;

  const { _id: productId, title, description, thumbnail } = product;
  const { country, district, state, address } = buyAddress;

  const onSubmit = async (data: FormType) => {
    const reason = data.reason;
    mutate(reason);
  };

  return (
    <>
      <section className="bg-bg_bg p-2 md:p-5">
        <main className="bg-background ">
          <p className="border-b-2 text-xl font-semibold p-5">
            Cancelling the Order
          </p>

          <div className="space-y-10">
            {/* MARK: UPPER PORTION */}
            <div className="w-full flex gap-5 flex-col lg:flex-row p-3">
              <section className="flex gap-5">
                <div className="lg:w-48 md:w-40 w-32 grow-0 shrink-0">
                  <Link to={`/products/${productId}`}>
                    <img
                      src={thumbnail}
                      alt={title}
                      className=" w-full object-cover"
                    />
                  </Link>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <div>
                    <Link to={`/products/${productId}`}>
                      <p className="font-semibold">{title}</p>
                    </Link>
                    <p className="text-xs line-clamp-2 lg:line-clamp-3">
                      {description}
                    </p>
                  </div>

                  <p className="text-xl font-semibold tracking-wide">
                    {symbol}
                    {buyPrice}
                  </p>
                  <div className="text-xs">Qty : {quantity}</div>

                  {/* MARK: ADDRESS */}
                  <div className="flex flex-col mt-1 gap-1 lg:flex-row lg:gap-3 text-sm">
                    <p>Address:</p>
                    <div className="cursor-pointer">
                      <p className="text-sm">{address}</p>
                      <div className="flex">
                        <p className="text-sm">{district},</p>
                        <p className="ml-2 text-sm">{state}</p>
                        <p className="mx-1">-</p>
                        <p>{country}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <div className="w-60 grow-0 shrink-0">
                {!isDelivered && (
                  <div className="flex items-center gap-3 text-sm">
                    <p>Delievered By:</p>
                    <p className="text-base">
                      {makeDateFromUTC(deliveredDate)}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <p>Ordered on:</p>
                  <p className="">{makeDateFromUTC(createdAt)}</p>
                </div>
              </div>
            </div>

            {/* MARK: CANCEL FORM */}
            <form
              className="px-3 pb-3 lg:px-7 lg:pb-7 space-y-10"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <div className="border">
                  <textarea
                    rows={5}
                    {...register("reason", {
                      required:
                        "Please write the reason for cancelling the order",
                    })}
                    placeholder="Why do you want to cancel the order. Give suggestion to improve our services"
                    className="p-3 w-full bg-inherit resize-none"
                    maxLength={200} // Add maxLength attribute
                  />
                </div>
                <p className="text-red-500 text-xs h-4 mt-1 ml-1">
                  {errors.reason?.message}
                </p>
              </div>
              <div className="flex justify-end items-center gap-10">
                <button type="button" onClick={() => navigate("/user/orders")}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded cursor-pointer py-2 px-10 bg-slate-600 text-white hover:brightness-90"
                >
                  {isPending ? (
                    <Loading small={true} height={"full"} />
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </section>
    </>
  );
};

export default OrderCancel;
