import { useSelector } from "react-redux";
import { localStorageState } from "../../redux/slice/localStorageSlice";
import { Helmet } from "react-helmet";
import { loadStripe } from "@stripe/stripe-js";
import { postReq } from "../../utils/api/api";
import Toastify from "../../lib/Toastify";
import { addressState } from "../../redux/slice/addressSlice";
import environment from "../../utils/environment";
import { currencyState } from "../../redux/slice/currencySlice";
import CheckoutProducts from "./CheckoutProducts";

const Checkout = () => {
  const { cart } = useSelector(localStorageState);
  const { selectedAddress } = useSelector(addressState);
  const { code, exchangeRate } = useSelector(currencyState);

  const cartIds = cart.map((obj) => obj.id);
  const { ToastContainer, showErrorMessage } = Toastify();

  const makePayment = async () => {
    try {
      const stripe = await loadStripe(environment.STRIPE_PUBLISHABLE_KEY);

      const checkoutSession = await postReq("/payment", {
        products: cart,
        address: selectedAddress,
        code,
        exchangeRate,
      });

      stripe.redirectToCheckout({
        sessionId: checkoutSession.session.id,
      });
    } catch (error) {
      showErrorMessage({
        message: error.message || "Issue in doing Payment. Try later...",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Checkout</title>
        <meta name="description" content={`Order Summary of Commercify App`} />
      </Helmet>

      <section className="bg-white">
        <p className="py-4 px-10  uppercase tracking-wider font-semibold bg-blue-500 text-white">
          Order Summary
        </p>
        {cartIds.length > 0 ? (
          <div>
            <CheckoutProducts list={cartIds} />
          </div>
        ) : (
          <div>No Cart</div>
        )}
        <div className="flex justify-end py-3 px-10 sticky bottom-0 place_order_box bg-white">
          <button
            className="py-4 px-16 rounded-md bg-orange-400 text-white font-semibold tracking-wide cursor-pointer"
            onClick={makePayment}
          >
            Proceed to Payment
          </button>
        </div>
      </section>
      <ToastContainer />
    </>
  );
};

export default Checkout;
