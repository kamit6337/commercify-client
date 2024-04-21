import makeDateDaysAfter from "../../utils/javascript/makeDateDaysAfter";

/* eslint-disable react/prop-types */
const OrderStatus = ({
  isDelievered,
  isCancelled,
  isReturned,
  delieveredDate,
  updatedAt,
}) => {
  if (isDelievered) {
    return (
      <div>
        <div className="border rounded bg-green-500 text-white py-2 px-5 text-center">
          Delievered
        </div>
        <div className="flex items-center gap-3 text-sm mt-1">
          <p>On: </p>
          <p>{makeDateDaysAfter(delieveredDate, 0)}</p>
        </div>
      </div>
    );
  }
  if (isCancelled) {
    return (
      <div>
        <div className="border rounded bg-red-500 text-white py-2 px-5 text-center">
          Cancelled
        </div>
        <div className="flex items-center gap-3 text-sm mt-1">
          <p>On: </p>
          <p>{makeDateDaysAfter(updatedAt, 0)}</p>
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
          <p>{makeDateDaysAfter(updatedAt, 0)}</p>
        </div>
      </div>
    );
  }

  if (!isDelievered) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <p>Delievered By:</p>
        <p className="text-base">
          {makeDateDaysAfter(delieveredDate || updatedAt, 0)}
        </p>
      </div>
    );
  }

  return null;
};

export default OrderStatus;
