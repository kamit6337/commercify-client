import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { currencyState } from "../../redux/slice/currencySlice";
import Toastify from "../../lib/Toastify";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import changePriceDiscountByExchangeRate from "../../utils/javascript/changePriceDiscountByExchangeRate";
import makeDateFromUTC from "../../utils/javascript/makeDateFromUTC";
import useSingleBuy from "@/hooks/buys/useSingleBuy";
import Loading from "@/lib/Loading";
import useOrderReturn from "@/hooks/orders/useOrderReturn";
import countries from "@/data/countries";

const listOfReasons = [
  "Product is defective or expired",
  "Product quality was not as expected",
  "Packaging was broken while arrived",
  "Delivered a different product from what ordered",
  "Some other issues",
];

type FormType = {
  reason: string;
};

type Params = {
  buyId: string;
};

const OrderReturn = () => {
  const navigate = useNavigate();
  const { buyId } = useParams() as Params;
  const [optionSelected, setOptionSelected] = useState<number | null>(null);
  const { symbol } = useSelector(currencyState);
  const { showAlertMessage, showSuccessMessage } = Toastify();
  const { isLoading, error, data: buyProduct } = useSingleBuy(buyId);

  const { mutate, isPending, isSuccess } = useOrderReturn(buyId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    defaultValues: {
      reason: "",
    },
  });

  const countrySymbol = useMemo(() => {
    if (!buyProduct) return symbol;

    const {
      address: { country },
    } = buyProduct;

    const findCountry = countries.find(
      (countryObj) => countryObj.name.toLowerCase() === country.toLowerCase()
    );

    if (!findCountry) return symbol;

    return findCountry.currency.symbol;
  }, [buyProduct]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [buyId]);

  useEffect(() => {
    if (isSuccess) {
      showSuccessMessage({ message: "Returning order placed successfully" });
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
    price,
    quantity,
    address: buyAddress,
    isDelievered,
    deliveredDate,
    createdAt,
    exchangeRate,
  } = buyProduct;

  const { _id: productId, title, description, thumbnail } = product;
  const { country, district, state, address } = buyAddress;

  const onSubmit = async (data: FormType) => {
    if (!optionSelected) {
      showAlertMessage({ message: "Select one of the reason for returning" });
      return;
    }

    let reason = "";
    if (optionSelected === listOfReasons.length) {
      reason = data.reason;
    } else {
      reason = listOfReasons[optionSelected + 1];
    }

    mutate(reason);
  };

  const { exchangeRatePrice } = changePriceDiscountByExchangeRate(
    price,
    0,
    exchangeRate
  );

  return (
    <>
      <section className="bg-gray-100 p-2 md:p-5">
        <main className="bg-white space-y-10 ">
          <p className="border-b-2 text-xl font-semibold p-5">
            Returning the Order
          </p>

          <div className="space-y-10">
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
                    {countrySymbol}
                    {exchangeRatePrice}
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

            {/* MARK: OPTION FOR RETURNING */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-10 px-6 lg:px-16 py-10 border-t"
            >
              <p className="text-lg font-semibold">
                Select the reason for returning the order
              </p>
              <div className="">
                {listOfReasons.map((reason, i) => {
                  const strID = (i + 1).toString();

                  return (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="radio"
                        id={strID}
                        checked={optionSelected === i + 1}
                        onChange={() => setOptionSelected(i + 1)}
                      />
                      <label htmlFor={strID}>
                        <p>{reason}</p>
                      </label>
                    </div>
                  );
                })}
              </div>

              {/* MARK: CANCEL FORM */}
              {optionSelected === listOfReasons.length && (
                <div className="">
                  <div>
                    <div className="border">
                      <textarea
                        rows={5}
                        {...register("reason", {
                          required:
                            "Please write the reason for returning the order",
                        })}
                        placeholder="Why do you want to return the order? Give issues related to product."
                        className="p-3 w-full"
                        maxLength={200} // Add maxLength attribute
                      />
                    </div>
                    <p className="text-red-500 text-xs h-4 mt-1 ml-1">
                      {errors.reason?.message}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex justify-end items-center gap-10">
                <button type="button" onClick={() => navigate("/user/orders")}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded cursor-pointer py-2 px-10 bg-slate-600 text-white"
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

export default OrderReturn;
