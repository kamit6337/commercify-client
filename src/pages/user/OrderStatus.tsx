import { BUY } from "@/types";
import makeDateFromUTC from "../../utils/javascript/makeDateFromUTC";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import ShowRating from "./ShowRating";

type Props = BUY;

const OrderStatus = ({
  rating,
  isDelivered,
  isCancelled,
  reasonForCancelled,
  reasonForReturned,
  isReturned,
  deliveredDate,
  _id: buyId,
  product: { _id: productId },
  updatedAt,
}: Props) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isAdminRoute = pathname.startsWith("/admin");

  // if (isReturned && !isAdminRoute && rating) {
  //   return (
  //     <AlertDialog>
  //       <div className="space-y-1">
  //         <div className="flex items-center gap-3 text-xs md:text-sm mt-1">
  //           <p>On: </p>
  //           <p>{makeDateFromUTC(updatedAt)}</p>
  //         </div>
  //         <div className="border rounded bg-red-300 text-white py-2 px-5 text-center">
  //           Returned
  //         </div>
  //         <AlertDialogTrigger>
  //           <button className="border rounded hover:bg-green-400 bg-green-200 py-2 px-5 text-center font-semibold text-green-800">
  //             Your Rating
  //           </button>
  //         </AlertDialogTrigger>
  //       </div>
  //       <ShowRating rating={rating} buyId={buyId} />
  //     </AlertDialog>
  //   );
  // }

  if (isReturned) {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-3 text-xs md:text-sm mt-1">
          <p>On: </p>
          <p>{makeDateFromUTC(updatedAt)}</p>
        </div>
        <div className="border rounded bg-red-300 text-white py-2 px-5 text-center">
          Returned
        </div>
        {!isAdminRoute && (
          <p className="text-red-500 whitespace-normal line-clamp-3">
            {" "}
            <span className="text-foreground mr-1">Reason :</span>
            {reasonForReturned}
          </p>
        )}
      </div>
    );
  }

  if (isCancelled) {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-3 text-xs md:text-sm">
          <p>On: </p>
          <p>{makeDateFromUTC(updatedAt)}</p>
        </div>
        <div className="border rounded bg-red-500 text-white py-2 px-5 text-center">
          Cancelled
        </div>
        {!isAdminRoute && (
          <p className="text-red-500 whitespace-normal line-clamp-3">
            {" "}
            <span className="text-foreground mr-1">Reason :</span>
            {reasonForCancelled}
          </p>
        )}
      </div>
    );
  }

  if (isDelivered && !isAdminRoute && !rating) {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-3 text-xs md:text-sm">
          <p>On: </p>
          <p>{makeDateFromUTC(deliveredDate)}</p>
        </div>
        <div className="border rounded bg-green-500 text-white py-2 px-5 text-center">
          Delievered
        </div>
        <button
          className="border text-slate-800 rounded hover:bg-gray-400 bg-gray-200 py-2 px-5 text-center"
          onClick={() =>
            navigate(`/ratings/create?product=${productId}&buy=${buyId}`)
          }
        >
          Rate this Product
        </button>
      </div>
    );
  }

  if (isDelivered && !isAdminRoute && rating) {
    return (
      <AlertDialog>
        <div className="space-y-1">
          <div className="flex items-center gap-3 text-xs md:text-sm">
            <p>On: </p>
            <p>{makeDateFromUTC(deliveredDate)}</p>
          </div>
          <div className="border rounded bg-green-500 text-white py-2 px-5 text-center">
            Delievered
          </div>
          <AlertDialogTrigger>
            <button className="border rounded hover:bg-green-400 bg-green-200 py-2 px-5 text-center font-semibold text-green-800">
              Your Rating
            </button>
          </AlertDialogTrigger>
        </div>
        <ShowRating rating={rating} buyId={buyId} />
      </AlertDialog>
    );
  }

  if (isDelivered) {
    return (
      <div>
        <div className="flex items-center gap-3 text-xs md:text-sm mt-1">
          <p>On: </p>
          <p>{makeDateFromUTC(deliveredDate)}</p>
        </div>
        <div className="border rounded bg-green-500 text-white py-2 px-5 text-center">
          Delievered
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
