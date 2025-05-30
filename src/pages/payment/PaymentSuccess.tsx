import useBuyProducts from "@/hooks/buys/useBuyProducts";
import Loading from "@/lib/Loading";
import Toastify from "@/lib/Toastify";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Product from "./Product";
import { BUY } from "@/types";
import { useDispatch } from "react-redux";
import { emptyCart } from "@/redux/slice/cartAndWishlistSlice";

const PaymentSuccess = () => {
  const orderId = useSearchParams()[0].get("orderId") as string;
  const navigate = useNavigate();
  const { isLoading, error, data, refetch, isSuccess } =
    useBuyProducts(orderId);
  const [retryCount, setRetryCount] = useState(0);
  const { showErrorMessage } = Toastify();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess) {
      dispatch(emptyCart());
    }
  }, [isSuccess]);

  useEffect(() => {
    if (!orderId) {
      showErrorMessage({ message: "Issue in getting Product confirmation" });
      navigate("/");
    }
  }, [orderId]);

  // Retry if data is empty, up to 3 times
  useEffect(() => {
    if (!error && data?.length === 0 && retryCount < 5) {
      const retryTimeout = setTimeout(() => {
        refetch();
        setRetryCount((prev) => prev + 1);
      }, 2000); // wait 2 second between retries

      return () => clearTimeout(retryTimeout);
    }
  }, [data, error, retryCount, refetch]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="h-96 w-full flex justify-center items-center">
        <p>{error.message}</p>
      </div>
    );
  }

  const buyProducts = data;

  if (buyProducts.length === 0) {
    return (
      <div className="h-96 w-full flex flex-col justify-center items-center">
        <p>
          Your payment was successful, but we're still processing your order.
        </p>
        <p>Please check back in a few minutes or contact support.</p>
      </div>
    );
  }

  return (
    <section className="bg-gray-100 lg:p-5 p-2">
      <main className="bg-white">
        <div className="p-5 flex flex-col items-start lg:items-center lg:flex-row justify-between border-b gap-5">
          <div>
            <p className="text-2xl tablet:text-lg font-semibold tracking-wide">
              Payment is successful
            </p>
            <p className="tablet:text-xs">Your orders has been created</p>
          </div>
          <Link to={`/`}>
            <div className="px-20 tablet:px-10 py-3 bg-orange-500 text-white rounded-md">
              Continue Shopping
            </div>
          </Link>
        </div>
        {buyProducts.map((buy: BUY) => {
          return (
            <div key={buy._id}>
              <Product buyProduct={buy} />
            </div>
          );
        })}
      </main>
    </section>
  );
};

export default PaymentSuccess;
