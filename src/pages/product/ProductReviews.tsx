import { Link } from "react-router-dom";
import useLoginCheck from "../../hooks/auth/useLoginCheck";
import useGetProductRatings from "@/hooks/ratings/useGetProductRatings";
import Loading from "@/lib/Loading";
import Icons from "@/assets/icons";
import { PRODUCT } from "@/types";
import SingleRating from "./SingleRating";

type Props = {
  product: PRODUCT;
};

const ProductReviews = ({ product }: Props) => {
  const { data: user } = useLoginCheck();
  const { _id: productId, rate, rateCount } = product;

  const rateValue = Math.floor(rate);
  let fraction = rate - rateValue;
  fraction = parseFloat(fraction.toFixed(2));

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

  const productRatings = data?.pages.flat(1);
  const isUserRated = productRatings?.find(
    (obj) => obj?.user?._id === user._id
  );

  return (
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
            {Array.from({ length: 5 }).map((VALUE, i) => {
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
            <p>{productRatings?.length} reviews</p>
          </div>
          {!isUserRated && (
            <Link to={`/ratings/create?product=${productId}`}>
              <button className="p-2 bg-gray-100 mt-5 rounded">
                Rate this Product
              </button>
            </Link>
          )}
        </div>

        {/* MARK: USER RATINGS */}
        <main className="flex-1 border">
          {!productRatings?.length ? (
            <div className="w-full h-96 flex justify-center items-center">
              No Reviews yet
            </div>
          ) : (
            <div className="">
              {productRatings?.map((review) => {
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
  );
};

export default ProductReviews;
