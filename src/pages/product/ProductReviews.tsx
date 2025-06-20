import useGetProductRatings from "@/hooks/ratings/useGetProductRatings";
import Loading from "@/lib/Loading";
import { PRODUCT, REVIEW } from "@/types";
import SingleRating from "./SingleRating";
import StarRating from "@/lib/StarRating";

type Props = {
  product: PRODUCT;
};

const ProductReviews = ({ product }: Props) => {
  const { _id: productId, rating } = product;

  const rate = rating?.avgRating || 0;
  const rateCount = rating?.totalRatings || 0;
  const commentCount = rating?.totalComments || 0;

  const {
    isLoading: isLoadingRatings,
    error: errorRatings,
    data,
  } = useGetProductRatings(productId);

  if (isLoadingRatings) {
    return <Loading />;
  }

  if (errorRatings) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        {errorRatings?.message}
      </div>
    );
  }

  const productRatings = data?.pages.flatMap((page) => page) as REVIEW[];

  return (
    <article className="py-10 section_padding">
      <p className="text-2xl font-semibold tracking-wide capitalize text-important_text">
        Ratings and Reviews
      </p>
      <section className="flex flex-col lg:flex-row  mt-10 gap-10">
        <div className="sm:w-96 w-full flex flex-col gap-2 items-center lg:sticky static top-[100px] shadow-2xl py-10 dark:border rounded h-60">
          {/* MARK: RATE AVERAGE VALUE */}
          <p className="text-3xl">{rate}</p>

          {/* MARK: RATE AVERAGE VALUE STAR */}
          <StarRating rate={rate} />

          {/* MARK: RATE AND REVIEWS COUNT */}
          <div className="text-sm">
            <p>{rateCount} ratings &</p>
            <p>{commentCount} reviews</p>
          </div>
        </div>

        {/* MARK: USER RATINGS */}
        <main className="flex-1 border rounded">
          {productRatings.length === 0 ? (
            <div className="w-full h-96 flex justify-center items-center">
              No Reviews yet
            </div>
          ) : (
            <div className="">
              {productRatings.map((review: REVIEW) => {
                return <SingleRating key={review._id} review={review} />;
              })}
            </div>
          )}
        </main>
      </section>
    </article>
  );
};

export default ProductReviews;
