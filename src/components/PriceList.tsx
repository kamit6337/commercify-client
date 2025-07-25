import { useSelector } from "react-redux";
import { currencyState } from "../redux/slice/currencySlice";
import amountToWordsInternational from "../utils/javascript/amountToWordsInternational";
import { useMemo } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import environment from "../utils/environment";
import { postReq } from "../utils/api/api";
import Toastify from "../lib/Toastify";
import { ADDRESS, PRODUCT } from "@/types";
import rupeesToWords from "@/utils/javascript/rupeesToWords";
import useUserAddress from "@/hooks/address/useUserAddress";
import { cartAndWishlistState } from "@/redux/slice/cartAndWishlistSlice";

type Props = {
  products: PRODUCT[];
};

const PriceList = ({ products }: Props) => {
  const { data: addresses } = useUserAddress();
  const { cart } = useSelector(cartAndWishlistState);

  const { symbol, currency_code, country, currency_name } =
    useSelector(currencyState);

  const { pathname } = useLocation();
  const { showErrorMessage } = Toastify();
  const addressId = useSearchParams()[0].get("address") as string;

  const selectedAddress =
    addresses.find((address: ADDRESS) => address._id === addressId) ||
    addresses[0];

  const { actualProductPrice, sellingPrice, productsDiscount } = useMemo(() => {
    let actualProductPrice = 0;
    let sellingPrice = 0;
    let productsDiscount = 0;

    if (!products || products.length === 0)
      return {
        actualProductPrice,
        sellingPrice,
        productsDiscount,
      };

    const filterData = products.filter((obj) => obj);

    filterData.forEach((product) => {
      const {
        _id,
        price: { price, discountedPrice },
      } = product;

      const findProduct = cart.find((obj) => obj.id === _id);

      if (!findProduct) return;

      const discountPercentCost = price - discountedPrice;

      actualProductPrice = actualProductPrice + findProduct.quantity * price;

      sellingPrice = sellingPrice + findProduct.quantity * discountedPrice;

      productsDiscount =
        productsDiscount + findProduct.quantity * discountPercentCost;
    });

    return { actualProductPrice, sellingPrice, productsDiscount };
  }, [products, cart]);

  const makePayment = async () => {
    try {
      const stripe = await loadStripe(environment.STRIPE_PUBLISHABLE_KEY);

      const checkoutSession = await postReq("/payment", {
        products: cart,
        address: selectedAddress,
        currency_code,
      });

      stripe?.redirectToCheckout({
        sessionId: checkoutSession.session.id,
      });
    } catch (error) {
      showErrorMessage({
        message:
          error instanceof Error
            ? error?.message
            : "Issue in doing Payment. Try later...",
      });
    }
  };

  const totalQuantity = cart.reduce((prev, current) => {
    return prev + current.quantity;
  }, 0);

  const deliveryCharges = products.reduce((acc, product) => {
    return (acc += product.price.deliveryCharge);
  }, 0);

  const productSellingPrice = sellingPrice + deliveryCharges;
  return (
    <div className="w-full">
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
          Delivery Charges <span>({products.length} item)</span>
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
              {rupeesToWords(productSellingPrice)} {currency_name}s
            </p>
          ) : (
            <p className="text-xs self-end">
              {amountToWordsInternational(productSellingPrice)} {currency_name}s
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
  );
};

export default PriceList;
