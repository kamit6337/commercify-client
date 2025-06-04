import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Toastify from "../../lib/Toastify";
import { useSelector } from "react-redux";
import { currencyState } from "../../redux/slice/currencySlice";
import { useEffect, useState } from "react";
import useSingleProduct from "@/hooks/products/useSingleProduct";
import Loading from "@/lib/Loading";
import Icons from "@/assets/icons";
import useNewRating from "@/hooks/ratings/useNewRating";

type Form = {
  title: string;
  comment: string;
};

const RateProduct = () => {
  const navigate = useNavigate();
  const productId = useSearchParams()[0].get("product") as string;

  const { symbol, currency_code } = useSelector(currencyState);
  const { isLoading, error, data } = useSingleProduct(productId);
  const [starSelected, setStarSelected] = useState(0);
  const { showAlertMessage } = Toastify();
  const { mutate, isPending, isSuccess } = useNewRating(productId);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      comment: "",
    },
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [productId]);

  useEffect(() => {
    if (isSuccess) {
      navigate(`/products/${productId}`);
    }
  }, [isSuccess]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        {error?.message}
      </div>
    );
  }

  const { title, description, price, thumbnail } = data;

  const onSubmit = async (data: Form) => {
    if (starSelected === 0) {
      showAlertMessage({ message: "Please select star to rate product" });
      return;
    }

    const { title, comment } = data;

    const obj = {
      product: productId,
      rate: starSelected,
      title,
      comment,
    };

    mutate(obj);
  };

  const { exchangeRatePrice, discountedPrice, roundDiscountPercent } =
    price[currency_code];

  return (
    <section className="bg-gray-100 p-5">
      <main className="bg-white ">
        <p className="border-b-2 text-xl font-semibold p-5">
          Rate and Review the Order
        </p>

        <div className="space-y-10">
          <div className="p-7">
            {/* MARK: UPPER PORTION */}
            <div className="w-full flex gap-10">
              <div className="h-full w-48">
                <Link to={`/products/${productId}`}>
                  <img
                    src={thumbnail}
                    alt={title}
                    className="h-full w-full object-cover"
                  />
                </Link>
              </div>
              <section className="flex-1 flex flex-col gap-4">
                <div>
                  <Link to={`/products/${productId}`}>
                    <p>{title}</p>
                  </Link>
                  <p className="text-xs">{description}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <p className="text-2xl font-semibold tracking-wide">
                    {symbol}
                    {discountedPrice}
                  </p>
                  <p className="line-through">
                    {symbol}
                    {exchangeRatePrice}
                  </p>
                  <p className="text-xs">{roundDiscountPercent}% Off</p>
                </div>
              </section>
            </div>
          </div>

          {/* MARK: FORM */}
          <form
            className="px-7 pb-7 space-y-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex gap-5 items-center">
              <p className="text-lg">Rate the Product</p>
              <div className="flex text-2xl h-10">
                {Array.from({ length: 5 }).map((_value, i) => {
                  const newI = i + 1;

                  if (newI <= starSelected) {
                    return (
                      <p
                        key={i}
                        className="cursor-pointer hover:text-3xl duration-300 w-8 flex items-center justify-center"
                        onClick={() => setStarSelected(i + 1)}
                      >
                        <Icons.star className="text-yellow-300" />
                      </p>
                    );
                  }

                  return (
                    <p
                      key={i}
                      className="cursor-pointer hover:text-3xl duration-300 w-8 flex items-center justify-center"
                      onClick={() => setStarSelected(i + 1)}
                    >
                      <Icons.star_empty className="" />
                    </p>
                  );
                })}
              </div>
            </div>

            {/* MARK: TITLE */}
            <div>
              <div className="border">
                <input
                  type="text"
                  {...register("title", {
                    validate: (value) => {
                      if (value && !getValues().comment) {
                        return "Please provide comment";
                      }
                      return true;
                    },
                  })}
                  placeholder="Title"
                  className="p-3 w-full text-lg font-semibold"
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
              <p className="text-xs text-red-500 h-4 ml-1 mt-1">
                {errors.comment?.message}
              </p>
            </div>

            {/* MARK: COMMENT */}
            <div>
              <div className="border">
                <textarea
                  rows={5}
                  {...register("comment", {
                    validate: (value) => {
                      if (value && !getValues().title) {
                        return "Please provide title";
                      }
                      return true;
                    },
                  })}
                  placeholder="Comment on Product"
                  className="p-3 w-full"
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
              <p className="text-xs text-red-500 h-4 ml-1 mt-1">
                {errors.title?.message}
              </p>
            </div>

            {/* MARK: SUBMIT AND CANCEL */}
            <div className="flex justify-end items-center gap-10">
              <Link to={`/products/${productId}`}>
                <button>Cancel</button>
              </Link>
              <button
                type="submit"
                disabled={isPending}
                className="rounded cursor-pointer py-3 px-20 bg-slate-600 text-white"
              >
                {isPending ? (
                  <Loading height={"full"} small={true} />
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </section>
  );
};

export default RateProduct;
