import { REVIEW } from "@/types";
import Icons from "@/assets/icons";

type Props = {
  review: REVIEW;
};

const SingleRating = ({ review }: Props) => {
  const {
    title,
    comment,
    rate,
    user: { name, photo },
  } = review;

  if (!title) return;

  return (
    <div className="space-y-3 border-b last:border-none p-5">
      {/* MARK: FIRST LINE */}
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
