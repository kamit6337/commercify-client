import { Icons } from "../../assets/icons";
import { Link } from "react-router-dom";
import useLoginCheck from "../../hooks/auth/useLoginCheck";
import Toastify from "../../lib/Toastify";
import useProductRatings from "../../hooks/query/useProductRatings";
import Loading from "../../containers/Loading";
import SingleRating from "./SingleRating";

const ProductReviews = ({ product }) => {
  const { data: user } = useLoginCheck();

  const { ToastContainer } = Toastify();

  const { _id: productId, rate, rateCount } = product;

  const rateValue = Math.floor(rate);
  let fraction = rate - rateValue;
  fraction = parseFloat(fraction.toFixed(2));

  const {
    isLoading: isLoadingRatings,
    error: errorRatings,
    data,
  } = useProductRatings(productId);

  if (isLoadingRatings) {
    return (
      <div className="w-full h-96">
        <Loading />
      </div>
    );
  }

  if (errorRatings) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        {errorRatings?.message}
      </div>
    );
  }

  const productRatings = data?.pages.flat();

  const isUserRated = productRatings.find((obj) => obj?.user?._id === user._id);

  return (
    <>
      <article className="py-10 section_padding">
        <p className="text-2xl font-semibold tracking-wide capitalize text-important_text">
          Ratings and Reviews
        </p>
        <section className="flex tablet:flex-col  mt-10 gap-10">
          <div className="w-96 mobile:w-full flex flex-col gap-2 items-center self-start tablet:self-center sticky tablet:static top-[100px] shadow-2xl py-10">
            {/* MARK: RATE AVERAGE VALUE */}
            <p className="text-3xl">{rateValue + fraction}</p>

            {/* MARK: RATE AVERAGE VALUE STAR */}
            <div className="flex text-2xl h-10">
              {Array.from({ length: 5 }).map((value, i) => {
                if (i < rateValue) {
                  return (
                    <p key={i} className="w-8 flex items-center justify-center">
                      <Icons.star className="text-yellow-300" />
                    </p>
                  );
                }

                if (i === rateValue && fraction > 0) {
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
              <p>{rateCount} ratings &</p>
              <p>{productRatings.length} reviews</p>
            </div>
            {!isUserRated && (
              <Link to={`/ratings/${productId}`}>
                <button className="p-2 bg-gray-100 mt-5 rounded">
                  Rate this Product
                </button>
              </Link>
            )}
          </div>

          {/* MARK: USER RATINGS */}
          <main className="flex-1 border">
            {productRatings.length === 0 ? (
              <div className="w-full h-96 flex justify-center items-center">
                No Reviews yet
              </div>
            ) : (
              <div className="">
                {productRatings.map((review) => {
                  return (
                    <SingleRating
                      key={review._id}
                      review={review}
                      productId={productId}
                    />
                  );
                })}
              </div>
            )}
          </main>
        </section>
      </article>
      <ToastContainer />
    </>
  );
};

export default ProductReviews;
