/* eslint-disable react/prop-types */
import { useMemo } from "react";
import { Icons } from "../../assets/icons";
import { useSelector } from "react-redux";
import { ratingState } from "../../redux/slice/ratingSlice";
import { Link } from "react-router-dom";
import useLoginCheck from "../../hooks/auth/useLoginCheck";

const ProductReviews = ({ id }) => {
  const { ratings } = useSelector(ratingState);
  const { data: user } = useLoginCheck();

  const productRatings = useMemo(() => {
    if (ratings.length === 0) return [];

    const filter = ratings.filter((obj) => obj.product === id);
    return filter;
  }, [id, ratings]);

  const [rate, reviews, rateValue, fraction] = useMemo(() => {
    let rateValueCount = null;
    let rateCount = null;
    let reviewsCount = null;
    let fractionCount = null;

    if (productRatings.length === 0) {
      rateCount = [];
      reviewsCount = [];
      rateValueCount = 0;
      fractionCount = 0;
    } else {
      rateCount = productRatings.filter((obj) => obj.rate);
      reviewsCount = productRatings.filter((obj) => obj.title && obj.comment);

      rateValueCount = rateCount.reduce((prev, current) => {
        const { rate } = current;
        return prev + rate;
      }, 0);

      const floatValue = parseFloat(
        (rateValueCount / rateCount.length).toFixed(1)
      );

      rateValueCount = Math.floor(floatValue); // Extract integer part
      fractionCount = floatValue - rateValueCount; // Calculate fractional part
    }

    return [rateCount, reviewsCount, rateValueCount, fractionCount];
  }, [productRatings]);

  const isUserRated = useMemo(() => {
    if (productRatings.length === 0) {
      return false;
    }

    const findUser = productRatings.find((obj) => obj.user._id === user._id);

    if (findUser) {
      return true;
    }

    return false;
  }, [productRatings, user]);

  return (
    <article className="py-10 mx-10">
      <p className="text-2xl font-semibold tracking-wide capitalize">
        Ratings and Reviews
      </p>
      <section className="flex mt-10 gap-10">
        <div className="w-96 flex flex-col gap-2 items-center self-start sticky top-[100px] shadow-2xl py-10">
          {/* MARK: RATE AVERAGE VALUE */}
          <p className="text-3xl">{rateValue + fraction}</p>

          {/* MARK: RATE AVERAGE VALUE STAR */}
          <div className="flex text-2xl h-10">
            {Array.from({ length: 5 }).map((value, i) => {
              const newI = i + 1;

              if (newI <= rateValue) {
                return (
                  <p key={i} className="w-8 flex items-center justify-center">
                    <Icons.star className="text-yellow-300" />
                  </p>
                );
              }

              if (fraction >= 0.7) {
                return (
                  <p key={i} className="w-8 flex items-center justify-center">
                    <Icons.star className="text-yellow-300" />
                  </p>
                );
              }

              if (fraction >= 0.3) {
                return (
                  <p key={i} className="w-8 flex items-center justify-center">
                    <Icons.star_half className="text-yellow-300" />
                  </p>
                );
              }

              return (
                <p key={i} className="w-8 flex items-center justify-center">
                  <Icons.star_empty className="" />
                </p>
              );
            })}
          </div>

          {/* MARK: RATE AND REVIEWS COUNT */}
          <div className="text-sm">
            <p>{rate?.length} count &</p>
            <p>{reviews?.length} reviews</p>
          </div>

          {/* MARK: LINK TO RATE PRODUCT */}
          {!isUserRated && (
            <Link to={`/ratings/${id}`}>
              <button className="p-2 bg-gray-100 mt-5 rounded">
                Rate this Product
              </button>
            </Link>
          )}
        </div>

        {/* MARK: USER RATINGS */}
        <main className="flex-1 border">
          {reviews.length === 0 ? (
            <div className="w-full h-96 flex justify-center items-center">
              No Reviews yet
            </div>
          ) : (
            <div className="">
              {reviews.map((review, i) => {
                const {
                  title,
                  comment,
                  rate,
                  user: { name, photo },
                } = review;

                console.log("review", review);

                return (
                  <div
                    key={i}
                    className="space-y-3 border-b last:border-none p-5"
                  >
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
                      <p>Update Rate</p>
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
              })}
            </div>
          )}
        </main>
      </section>
    </article>
  );
};

export default ProductReviews;
