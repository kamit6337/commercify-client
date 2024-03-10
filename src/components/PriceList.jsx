import { useSelector } from "react-redux";
import { localStorageState } from "../redux/slice/localStorageSlice";
import useProductsFromIDs from "../hooks/query/useProductsFromIDs";
import Loading from "../containers/Loading";

const PriceList = () => {
  const { cart } = useSelector(localStorageState);

  const { data, isLoading, error } = useProductsFromIDs(cart);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const productPrice = data.reduce((prev, current) => {
    return prev + current.price;
  }, 0);
  const productDiscount = Math.floor(
    data.reduce((prev, current) => {
      const discount = (current.price * current.discountPercentage) / 100;

      return prev + discount;
    }, 0)
  );

  const deliveryCharges = 80;
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
        <p>{productPrice}</p>
      </div>
      <div className="p-4 flex justify-between">
        <p>Discount</p>
        <p>
          <span className="mx-1">-</span>
          {productDiscount}
        </p>
      </div>
      <div className="p-4 flex justify-between">
        <p>Delivery Charges</p>
        <p>{deliveryCharges}</p>
      </div>
      <div className="border-t p-4 flex justify-between">
        <p className="font-semibold">Total Amount</p>
        <p>{productSellingPrice}</p>
      </div>
      <p className="border-t p-4 text-sm text-green-600 font-semibold tracking-wide">
        You are saving {productDiscount} on this order
      </p>
    </div>
  );
};

export default PriceList;
