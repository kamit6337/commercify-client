import useBuyProducts from "@/hooks/buys/useBuyProducts";
import Loading from "@/lib/Loading";
import Toastify from "@/lib/Toastify";
import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Product from "./Product";
import { BUY } from "@/types";

const PaymentSuccess = () => {
  const cartSessionId = useSearchParams()[0].get("cartSessionId") as string;
  const navigate = useNavigate();
  const { isLoading, error, data } = useBuyProducts(cartSessionId);

  const { showErrorMessage } = Toastify();

  useEffect(() => {
    if (!cartSessionId) {
      showErrorMessage({ message: "Issue in getting Product confirmation" });
      navigate("/");
    }
  }, [cartSessionId]);

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
        <p>Error Occur</p>
        <p>Try refresh the page</p>
      </div>
    );
  }

  return (
    <section className="bg-gray-100 p-5">
      <main className="bg-white">
        <div className="p-5 flex items-center justify-between border-b">
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
