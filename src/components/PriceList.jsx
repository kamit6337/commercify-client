import { useSelector } from "react-redux";
import { localStorageState } from "../redux/slice/localStorageSlice";
import useProductsFromIDs from "../hooks/query/useProductsFromIDs";
import Loading from "../containers/Loading";
import { currencyState } from "../redux/slice/currencySlice";
import rupeesToWords from "../utils/javascript/rupeesToWords";
import amountToWordsInternational from "../utils/javascript/amountToWordsInternational";
import changePriceDiscountByExchangeRate from "../utils/javascript/changePriceDiscountByExchangeRate";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import environment from "../utils/environment";
import { postReq } from "../utils/api/api";
import Toastify from "../lib/Toastify";
import { addressState } from "../redux/slice/addressSlice";

const PriceList = () => {
  const { cart } = useSelector(localStorageState);
  const cartIds = cart.map((obj) => obj.id);
  const { symbol, exchangeRate, country, name, code } =
    useSelector(currencyState);
  const { pathname } = useLocation();
  const { selectedAddress } = useSelector(addressState);
  const { data, isLoading, error } = useProductsFromIDs(cartIds);
  const { ToastContainer, showErrorMessage } = Toastify();

  const { actualProductPrice, sellingPrice, productsDiscount } = useMemo(() => {
    let actualProductPrice = 0;
    let sellingPrice = 0;
    let productsDiscount = 0;

    if (!data || data.length === 0) return;

    const filterData = data.filter((obj) => obj);

    filterData.forEach((product) => {
      const { _id, price, discountPercentage } = product;

      const findProduct = cart.find((obj) => obj.id === _id);

      const { discountedPrice, discountPercentCost, exchangeRatePrice } =
        changePriceDiscountByExchangeRate(
          price,
          discountPercentage,
          exchangeRate
        );

      actualProductPrice =
        actualProductPrice + findProduct.quantity * exchangeRatePrice;
      sellingPrice = sellingPrice + findProduct.quantity * discountedPrice;

      productsDiscount =
        productsDiscount + findProduct.quantity * discountPercentCost;
    });

    return { actualProductPrice, sellingPrice, productsDiscount };
  }, [data, cart, exchangeRate]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

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

  const totalQuantity = cart.reduce((prev, current) => {
    return prev + current.quantity;
  }, 0);

  const deliveryCharges = Math.round(data.length * exchangeRate * 0.48); //  dollars

  const productSellingPrice = sellingPrice + deliveryCharges;
  return (
    <>
      <div className="">
        <p className="uppercase p-4 border-b tracking-wide font-semibold text-gray-500 text-sm">
          Price Details
        </p>
        <div className="p-4 flex justify-between">
          <p>
            Price <span>({totalQuantity} item)</span>
          </p>
          <p>
            {symbol}
            {actualProductPrice}
          </p>
        </div>
        <div className="p-4 flex justify-between">
          <p>Discount</p>
          <p>
            <span className="mx-1">-</span>
            {symbol}
            {productsDiscount}
          </p>
        </div>
        <div className="p-4 flex justify-between">
          <p>
            Delivery Charges <span>({data.length} item)</span>
          </p>
          <p>
            {symbol}
            {deliveryCharges}
          </p>
        </div>
        <div className="border-t p-4 flex flex-col gap-2">
          <div className="flex justify-between">
            <p className="font-semibold">Total Amount</p>
            <p>
              {symbol}
              {productSellingPrice}
            </p>
          </div>
          <>
            {country === "India" ? (
              <p className="text-xs self-end">
                {rupeesToWords(productSellingPrice)} {name}s
              </p>
            ) : (
              <p className="text-xs self-end">
                {amountToWordsInternational(productSellingPrice)} {name}s
              </p>
            )}
          </>
        </div>
        <p className="border-t p-4 text-sm text-green-600 font-semibold tracking-wide">
          You are saving {symbol}
          {productsDiscount} on this order
        </p>
        {pathname === "/cart" && (
          <div className="hidden tablet:flex justify-end py-3 px-10 sticky bottom-0 place_order_box bg-white">
            <Link to={`/cart/address`}>
              <button className="py-4 px-16 rounded-md bg-orange-400 text-white font-semibold tracking-wide">
                Placed Order
              </button>
            </Link>
          </div>
        )}
        {pathname === "/cart/checkout" && (
          <div className="hidden tablet:flex justify-end py-3 px-10 sticky bottom-0 place_order_box bg-white">
            <button
              className="py-4 px-16 rounded-md bg-orange-400 text-white font-semibold tracking-wide cursor-pointer"
              onClick={makePayment}
            >
              Proceed to Payment
            </button>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default PriceList;
