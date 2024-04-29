import makeDateFromUTC from "../../utils/javascript/makeDateFromUTC";

/* eslint-disable react/prop-types */
const OrderStatus = ({
  isDelivered,
  isCancelled,
  isReturned,
  deliveredDate,
  updatedAt,
}) => {
  if (isDelivered) {
    return (
      <div>
        <div className="border rounded bg-green-500 text-white py-2 px-5 text-center">
          Delievered
        </div>
        <div className="flex items-center gap-3 text-sm mt-1">
          <p>On: </p>
          <p>{makeDateFromUTC(deliveredDate)}</p>
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
        <div className="flex items-center gap-3 text-sm">
          <p>On: </p>
          <p>{makeDateFromUTC(updatedAt)}</p>
        </div>
      </div>
    );
  }

  if (isReturned) {
    return (
      <div>
        <div className="border rounded bg-red-200 text-black py-2 px-5 text-center">
          Returned
        </div>
        <div className="flex items-center gap-3 text-sm mt-1">
          <p>On: </p>
          <p>{makeDateFromUTC(updatedAt)}</p>
        </div>
      </div>
    );
  }

  if (!isDelivered) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <p>Delievered By:</p>
        <p className="text-base">{makeDateFromUTC(deliveredDate)}</p>
      </div>
    );
  }

  return null;
};

export default OrderStatus;
