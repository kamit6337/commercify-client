import { BUY } from "@/types";
import makeDateFromUTC from "../../utils/javascript/makeDateFromUTC";
import { useNavigate } from "react-router-dom";

type Props = BUY;

const OrderStatus = ({
  isReviewed,
  isDelivered,
  isCancelled,
  isReturned,
  deliveredDate,
  _id: buyId,
  product: { _id: productId },
  updatedAt,
}: Props) => {
  const navigate = useNavigate();

  if (isDelivered) {
    console.log(isReviewed, productId);
  }

  if (isReturned) {
    return (
      <div>
        <div className="border rounded bg-red-300 text-white py-2 px-5 text-center">
          Returned
        </div>
        <div className="flex items-center gap-3 text-xs md:text-sm mt-1">
          <p>On: </p>
          <p>{makeDateFromUTC(updatedAt)}</p>
        </div>
      </div>
    );
  }

  if (isCancelled) {
    return (
      <div className="space-y-2">
        <div className="border rounded bg-red-500 text-white py-2 px-5 text-center">
          Cancelled
        </div>
        <div className="flex items-center gap-3 text-xs md:text-sm">
          <p>On: </p>
          <p>{makeDateFromUTC(updatedAt)}</p>
        </div>
      </div>
    );
  }

  if (isDelivered && !isReviewed) {
    return (
      <div className="space-y-1">
        <div className="border rounded bg-green-500 text-white py-2 px-5 text-center">
          Delievered
        </div>
        <button
          className="border rounded hover:bg-gray-400 bg-gray-200 py-2 px-5 text-center"
          onClick={() =>
            navigate(`/ratings/create?product=${productId}&buy=${buyId}`)
          }
        >
          Rate this Product
        </button>
        <div className="flex items-center gap-3 text-xs md:text-sm">
          <p>On: </p>
          <p>{makeDateFromUTC(deliveredDate)}</p>
        </div>
      </div>
    );
  }

  if (isDelivered) {
    return (
      <div>
        <div className="border rounded bg-green-500 text-white py-2 px-5 text-center">
          Delievered
        </div>
        <div className="flex items-center gap-3 text-xs md:text-sm mt-1">
          <p>On: </p>
          <p>{makeDateFromUTC(deliveredDate)}</p>
        </div>
      </div>
    );
  }

  if (!isDelivered) {
    return (
      <div className="flex items-center gap-3 text-xs md:text-sm">
        <p>Delievered By:</p>
        <p className="">{makeDateFromUTC(deliveredDate)}</p>
      </div>
    );
  }

  return null;
};

export default OrderStatus;
