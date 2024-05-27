import { Link } from "react-router-dom";
import useFailedBuyProducts from "../../hooks/query/useFailedBuyProducts";
import Loading from "../../containers/Loading";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { failedOrders } from "../../redux/slice/userOrdersSlice";

const PaymentCancel = () => {
  return (
    <section className="bg-gray-100 p-5">
      <main className="bg-white p-5">
        <p className="text-2xl p-5 text-red-500 ">Your Payment is Failed</p>
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
