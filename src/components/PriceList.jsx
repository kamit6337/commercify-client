import { useSelector } from "react-redux";
import { localStorageState } from "../redux/slice/localStorageSlice";
import useProductsFromIDs from "../hooks/query/useProductsFromIDs";
import Loading from "../containers/Loading";
import { currencyState } from "../redux/slice/currencySlice";

const PriceList = () => {
  const { cart } = useSelector(localStorageState);
  const cartIds = cart.map((obj) => obj.id);
  const { symbol, exchangeRate } = useSelector(currencyState);

  const { data, isLoading, error } = useProductsFromIDs(cartIds);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const productPrice = data.reduce((prev, current) => {
    const findProduct = cart.find((obj) => obj.id === current._id);

    return (
      prev + findProduct.quantity * Math.round(current.price * exchangeRate)
    );
  }, 0);

  const productDiscount = data.reduce((prev, current) => {
    const discount = Math.round(
      (Math.round(current.price * exchangeRate) *
        Math.round(current.discountPercentage)) /
        100
    );

    const findProduct = cart.find((obj) => obj.id === current._id);
    return prev + findProduct.quantity * discount;
  }, 0);

  const deliveryCharges = Math.round(data.length * exchangeRate); // 4 dollars

  const productSellingPrice = productPrice - productDiscount + deliveryCharges;
  return (
    <div className="">
      <p className="uppercase p-4 border-b tracking-wide font-semibold text-gray-500 text-sm">
        Price Details
      </p>
      <div className="p-4 flex justify-between">
        <p>
          Price <span>({data.length} item)</span>
        </p>
        <p>
          {symbol}
          {productPrice}
        </p>
      </div>
      <div className="p-4 flex justify-between">
        <p>Discount</p>
        <p>
          <span className="mx-1">-</span>
          {symbol}
          {productDiscount}
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
      <div className="border-t p-4 flex justify-between">
        <p className="font-semibold">Total Amount</p>
        <p>
          {symbol}
          {productSellingPrice}
        </p>
      </div>
      <p className="border-t p-4 text-sm text-green-600 font-semibold tracking-wide">
        You are saving {symbol}
        {productDiscount} on this order
      </p>
    </div>
  );
};

export default PriceList;
