import { useSelector } from "react-redux";
import { localStorageState } from "../../redux/slice/localStorageSlice";
import { Helmet } from "react-helmet";
import Products from "./Products";
import { loadStripe } from "@stripe/stripe-js";
import { postReq } from "../../utils/api/api";
import Toastify from "../../lib/Toastify";
import { addressState } from "../../redux/slice/addressSlice";

const Checkout = () => {
  const { cart } = useSelector(localStorageState);
  const { selectedAddress } = useSelector(addressState);

  const cartIds = cart.map((obj) => obj.id);
  const { ToastContainer, showErrorMessage } = Toastify();

  const makePayment = async () => {
    try {
      const stripe = await loadStripe(
        "pk_test_51OuirNSGG7QgSLfOM1J57EGui8wp5NWXgi2qaQo04Hp41ifrctCpag3FqotscdgHGwTo30QjZ6MNImWGwnPyOQvS00g5OAnYjr"
      );

      const checkoutSession = await postReq("/payment", {
        products: cart,
        address: selectedAddress,
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
            <Products list={cartIds} wishlist={false} />
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
