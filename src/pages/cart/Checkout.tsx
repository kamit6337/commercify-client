import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { loadStripe } from "@stripe/stripe-js";
import { postReq } from "../../utils/api/api";
import Toastify from "../../lib/Toastify";
import environment from "../../utils/environment";
import { currencyState } from "../../redux/slice/currencySlice";
import { useOutletContext } from "react-router-dom";
import { ADDRESS, PRODUCT } from "@/types";
import CheckoutProduct from "./CheckoutProduct";

type Product = {
  id: string;
  quantity: number;
};

type OUTLET = {
  products: PRODUCT[];
  addresses: ADDRESS[];
  cart: Product[];
};

const Checkout = () => {
  const { cart, products, addresses } = useOutletContext<OUTLET>();

  const selectedAddressId = sessionStorage.getItem("_address");
  const { code, exchangeRate, symbol } = useSelector(currencyState);

  const { showErrorMessage } = Toastify();

  const makePayment = async () => {
    try {
      const stripe = await loadStripe(environment.STRIPE_PUBLISHABLE_KEY);

      const checkoutSession = await postReq("/payment", {
        products: cart,
        address: selectedAddressId,
        code,
        exchangeRate,
        symbol,
      });

      await stripe?.redirectToCheckout({
        sessionId: checkoutSession.session.id,
      });
    } catch (error) {
      showErrorMessage({
        message:
          error instanceof Error
            ? error.message
            : "Issue in doing Payment. Try later...",
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
        {products.length > 0 ? (
          <div>
            <div>
              {products.map((product) => {
                return (
                  <CheckoutProduct
                    key={product._id}
                    product={product}
                    addresses={addresses}
                    cart={cart}
                  />
                );
              })}
            </div>
            <div className="tablet:hidden flex justify-end py-3 px-10 sticky bottom-0 place_order_box bg-white">
              <button
                className="py-4 px-16 rounded-md bg-orange-400 text-white font-semibold tracking-wide cursor-pointer"
                onClick={makePayment}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        ) : (
          <div>No Cart</div>
        )}
      </section>
    </>
  );
};

export default Checkout;
