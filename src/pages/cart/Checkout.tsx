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
import { useMemo, useState } from "react";
import PriceList from "@/components/PriceList";
import Loading from "@/lib/Loading";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  const { cart, products, addresses } = useOutletContext<OUTLET>();
  const { code, symbol } = useSelector(currencyState);
  const { showErrorMessage } = Toastify();
  const [isPending, setIsPending] = useState(false);

  const selectedAddress = useMemo(() => {
    const addressIdFromLocal = sessionStorage.getItem("_address");
    if (!addressIdFromLocal) return null;
    const findAddress = addresses.find(
      (address) => address._id === addressIdFromLocal
    );
    if (findAddress) return findAddress;
    return null;
  }, [addresses]);

  const makePayment = async () => {
    try {
      setIsPending(true);
      const selectedAddressId = selectedAddress?._id;

      if (!selectedAddressId) {
        showErrorMessage({
          message:
            "Issue in address selection. Please go back and select address",
        });
        return;
      }

      const stripe = await loadStripe(environment.STRIPE_PUBLISHABLE_KEY);

      const checkoutSession = await postReq("/payment", {
        products: cart,
        address: selectedAddressId,
        code,
        symbol,
      });

      queryClient.invalidateQueries({
        queryKey: ["buy products of user"],
        exact: true,
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
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Checkout</title>
        <meta name="description" content={`Order Summary of Commercify App`} />
      </Helmet>

      <section className="">
        <p className="py-4 px-10  uppercase tracking-wider font-semibold bg-blue-500 text-white">
          Order Summary
        </p>
        {products.length > 0 ? (
          <>
            <div className="space-y-5">
              <div className="bg-white">
                {products.map((product) => {
                  return (
                    <CheckoutProduct
                      key={product._id}
                      product={product}
                      selectedAddress={selectedAddress}
                      cart={cart}
                    />
                  );
                })}
              </div>
              <div className="md:hidden bg-white">
                <PriceList products={products} />
              </div>
            </div>
            <div className="flex justify-end py-3 px-10 border-t-2 sticky bottom-0 bg-white">
              <button
                className="py-4 px-16 rounded-md bg-orange-400 text-white font-semibold tracking-wider"
                disabled={isPending}
                onClick={makePayment}
              >
                {isPending ? (
                  <Loading small={true} height={"full"} />
                ) : (
                  "Proceed to Payment"
                )}
              </button>
            </div>
          </>
        ) : (
          <div>No Cart</div>
        )}
      </section>
    </>
  );
};

export default Checkout;
