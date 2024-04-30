import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { currencyState } from "../../redux/slice/currencySlice";
import Toastify from "../../lib/Toastify";
import {
  returnTheOrder,
  userOrdersState,
} from "../../redux/slice/userOrdersSlice";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { patchReq } from "../../utils/api/api";
import changePriceDiscountByExchangeRate from "../../utils/javascript/changePriceDiscountByExchangeRate";
import makeDateFromUTC from "../../utils/javascript/makeDateFromUTC";
import Loading from "../../containers/Loading";

const listOfResons = [
  "Product is defective or expired",
  "Product quality was not as expected",
  "Packaging was broken while arrived",
  "Delivered a different product from what ordered",
  "Some other issues",
];

const OrderReturn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { orders } = useSelector(userOrdersState);
  const [optionSelected, setOptionSelected] = useState(null);
  const { symbol, exchangeRate } = useSelector(currencyState);
  const { ToastContainer, showErrorMessage, showAlertMessage } = Toastify();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      reason: "",
    },
  });

  const buyProduct = useMemo(() => {
    if (!id) return null;
    const buy = orders.find((obj) => obj._id === id);
    return { ...buy };
  }, [id, orders]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [id]);

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
    deliveredDate,
    createdAt,
  } = buyProduct;

  const { _id: productId, title, description, thumbnail } = product;
  const { country, district, state, address } = buyAddress;

  const onSubmit = async () => {
    if (!optionSelected) {
      showAlertMessage({ message: "Select one of the reason for returning" });
      return;
    }

    try {
      const cancelOrder = await patchReq("/buy/return", { id: buyId });
      dispatch(returnTheOrder(cancelOrder.data));
      navigate("/user/orders");
    } catch (error) {
      showErrorMessage({ message: error.message });
    }
  };

  const { exchangeRatePrice } = changePriceDiscountByExchangeRate(
    price,
    0,
    exchangeRate
  );

  return (
    <>
      <section className="bg-gray-100 p-5">
        <main className="bg-white space-y-10 ">
          <p className="border-b-2 text-xl font-semibold p-5">
            Returning the Order
          </p>

          <div className="space-y-10">
            <div className="px-16">
              {/* MARK: UPPER PORTION */}
              <div className="w-full flex gap-10 tablet:flex-col">
                <div className="flex gap-10">
                  <div className="h-full w-48">
                    <Link to={`/products/${id}`}>
                      <img
                        src={thumbnail}
                        alt={title}
                        className="h-full w-full object-cover"
                      />
                    </Link>
                  </div>
                  <section className="flex-1 flex flex-col gap-2">
                    <div>
                      <Link to={`/products/${productId}`}>
                        <p>{title}</p>
                      </Link>
                      <p className="text-xs">{description}</p>
                    </div>

                    <p className="text-2xl font-semibold tracking-wide">
                      {symbol}
                      {exchangeRatePrice}
                    </p>
                    <div className="text-xs">Qty : {quantity}</div>
                  </section>
                </div>

                <div className="w-60 grow-0 shrink-0">
                  {!isDelievered && (
                    <div className="flex items-center gap-3 text-sm">
                      <p>Delievered On:</p>
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

              {/* MARK: LOWER PORTION */}
              <div className="flex justify-between items-center mt-6">
                {/* MARK: ADDRESS */}
                <div className="flex mt-1 gap-3 text-sm">
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
            </div>

            {/* MARK: OPTION FOR RETURNING */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-10 px-16 py-10 border-t"
            >
              <p className="text-lg font-semibold">
                Select the reason for returning the order
              </p>
              <div className="">
                {listOfResons.map((reason, i) => {
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="radio"
                        id={i + 1}
                        checked={optionSelected === i + 1}
                        onChange={() => setOptionSelected(i + 1)}
                      />
                      <label htmlFor={i + 1}>
                        <p>{reason}</p>
                      </label>
                    </div>
                  );
                })}
              </div>

              {/* MARK: CANCEL FORM */}
              {optionSelected === listOfResons.length && (
                <div className="">
                  <div>
                    <div className="border">
                      <textarea
                        rows={5}
                        {...register("reason", {
                          required:
                            "Please write the reason for returning the order",
                        })}
                        placeholder="Why do you want to return the order. Give issues related to product delivered"
                        className="p-3 w-full"
                      />
                    </div>
                    <p className="text-red-500 text-xs h-4 mt-1 ml-1">
                      {errors.reason?.message}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex justify-end items-center gap-10">
                <p>Cancel</p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded cursor-pointer py-2 px-10 bg-slate-600 text-white"
                >
                  {isSubmitting ? <Loading small={true} /> : "Submit"}
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

export default OrderReturn;
