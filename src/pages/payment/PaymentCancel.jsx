import { Link } from "react-router-dom";
import useFailedBuyProducts from "../../hooks/query/useFailedBuyProducts";
import Loading from "../../containers/Loading";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { failedOrders } from "../../redux/slice/userOrdersSlice";

const PaymentCancel = () => {
  const dispatch = useDispatch();
  const { isLoading, error, data } = useFailedBuyProducts();

  useEffect(() => {
    if (data) {
      dispatch(failedOrders(data.data));
    }
  }, [data, dispatch]);

  if (isLoading) {
    return (
      <div className="h-96 w-full">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 w-full flex justify-center items-center">
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <section className="bg-gray-100 p-5">
      <main className="bg-white p-5">
        <p className="text-2xl p-5 text-red-500 ">{data.message}</p>
        <div className="w-full h-96 flex flex-col gap-5 justify-center items-center">
          <Link to={`/cart/checkout`}>
            <p className="px-10 py-2 border text-xl bg-slate-800 text-white  rounded">
              Try Again
            </p>
          </Link>
          <Link to={`/`}>
            <p className="px-10 py-2 border rounded">Continue Shopping</p>
          </Link>
        </div>
      </main>
    </section>
  );
};

export default PaymentCancel;
