import { Link, useNavigate, useParams } from "react-router-dom";
import useUserOrders from "../../hooks/query/useUserOrders";
import { useMemo } from "react";
import makeDateDaysAfter from "../../utils/javascript/makeDateDaysAfter";
import { useForm } from "react-hook-form";
import SmallLoading from "../../containers/SmallLoading";
import { patchReq } from "../../utils/api/api";
import Toastify from "../../lib/Toastify";

const OrderCancel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, refetch } = useUserOrders();

  const { ToastContainer, showErrorMessage } = Toastify();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      reason: "",
    },
  });

  const buyProduct = useMemo(() => {
    if (!id || !data) return null;

    const buy = data.data.find((obj) => obj._id === id);
    return { ...buy };
  }, [id, data]);

  if (!buyProduct) {
    return (
      <div>
        <p>Error occur</p>
      </div>
    );
  }

  const {
    _id: buyId,
    product,
    price,
    quantity,
    address: buyAddress,
    isDelievered,
    createdAt,
    updatedAt,
  } = buyProduct;

  const { _id: productId, title, description, thumbnail } = product;
  const { pinCode, district, state, address } = buyAddress;

  const onSubmit = async () => {
    try {
      const cancelOrder = await patchReq("/buy/cancel", { id: buyId });
      console.log("cancelorder", cancelOrder);
      refetch();
      navigate("/user/orders");
    } catch (error) {
      showErrorMessage({ message: error.message });
    }
  };

  return (
    <>
      <section className="bg-gray-100 p-5">
        <main className="bg-white ">
          <p className="border-b-2 text-xl font-semibold p-5">
            Cancelling the Order
          </p>

          <div className="space-y-10">
            <div className="p-7">
              {/* MARK: UPPER PORTION */}
              <div className="w-full flex gap-10">
                <div className="h-full w-48">
                  <Link to={`/products/${id}`}>
                    <img
                      src={thumbnail}
                      alt={title}
                      className="h-full w-full object-cover"
                    />
                  </Link>
                </div>
                <section className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link to={`/products/${productId}`}>
                      <p>{title}</p>
                    </Link>
                    <p className="text-xs">{description}</p>
                  </div>

                  <p className="text-2xl font-semibold tracking-wide">
                    ${price}
                  </p>
                  <div className="text-xs">Qty : {quantity}</div>
                </section>
                <div className="">
                  {!isDelievered && (
                    <div className="flex items-center gap-3 text-sm">
                      <p>Delievered By:</p>
                      <p className="text-base">
                        {makeDateDaysAfter(updatedAt, 8)}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <p>Ordered on:</p>
                    <p className="">{makeDateDaysAfter(createdAt, 0)}</p>
                  </div>
                </div>
              </div>

              {/* MARK: LOWER PORTION */}
              <div className="flex justify-between items-center mt-6 ml-6">
                {/* MARK: ADDRESS */}
                <div className="flex mt-1 gap-3 text-sm">
                  <p>Address:</p>
                  <div className="cursor-pointer">
                    <p className="text-sm">{address}</p>
                    <div className="flex">
                      <p className="text-sm">{district},</p>
                      <p className="ml-2 text-sm">{state}</p>
                      <p className="mx-1">-</p>
                      <p>{pinCode}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MARK: CANCEL FORM */}
            <form
              className="px-7 pb-7 space-y-10"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="border">
                <textarea
                  rows={5}
                  {...register("reason", {
                    required: true,
                  })}
                  placeholder="Why do you want to cancel the order. Give suggestion to improve our services"
                  className="p-3 w-full"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded cursor-pointer py-2 px-10 bg-slate-600 text-white"
                >
                  {isSubmitting ? <SmallLoading /> : "Cancel"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </section>
      <ToastContainer />
    </>
  );
};

export default OrderCancel;
