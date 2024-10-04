import { useNavigate } from "react-router-dom";
import { Icons } from "../../assets/icons";
import useLoginCheck from "../../hooks/auth/useLoginCheck";
import { useState } from "react";
import useDeleteRating from "../../hooks/mutation/ratings/useDeleteRating";

const SingleRating = ({ review, productId }) => {
  const navigate = useNavigate();
  const { data: user } = useLoginCheck();
  const [showOptions, setShowOptions] = useState(false);

  const {
    _id,
    title,
    comment,
    rate,
    user: { _id: userId, name, photo },
  } = review;

  const { mutate, isPending } = useDeleteRating(productId, _id);

  const handleDelete = () => {
    mutate();
  };

  return (
    <div className="space-y-3 border-b last:border-none p-5">
      {/* MARK: FIRST LINE */}
      <div className="flex justify-between items-center">
        <div className="flex gap-5 ">
          <div
            className={`${
              rate <= 2 ? "bg-red-500" : "bg-green-600"
            } flex items-center  text-white text-xs px-1 rounded`}
          >
            <p>{rate}</p>
            <Icons.star className="" />
          </div>
          <p>{title}</p>
        </div>
        {userId === user._id && (
          <div className="relative">
            <button
              className="p-2"
              onClick={() => setShowOptions((prev) => !prev)}
            >
              {showOptions ? <Icons.cancel /> : <Icons.options />}
            </button>
            {showOptions && (
              <div className="absolute top-full right-0 border bg-white">
                <p
                  className="px-5 py-2 border-b cursor-pointer"
                  onClick={() =>
                    navigate(`/ratings/update/${_id}/${productId}`)
                  }
                >
                  Update
                </p>
                <button
                  disabled={isPending}
                  className="px-5 py-2  cursor-pointer"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <p>{comment}</p>
      <div className="flex items-center gap-2 pt-5 text-xs">
        <p className="w-6">
          <img
            src={photo}
            alt={name}
            className="w-full object-cover rounded-full"
          />
        </p>
        <p>{name}</p>
      </div>
    </div>
  );
};

export default SingleRating;
