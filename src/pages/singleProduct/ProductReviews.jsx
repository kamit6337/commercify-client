import { useState } from "react";
import { Icons } from "../../assets/icons";
import { useNavigate } from "react-router-dom";
import useLoginCheck from "../../hooks/auth/useLoginCheck";
import { deleteReq } from "../../utils/api/api";
import Toastify from "../../lib/Toastify";
import useProductRatings from "../../hooks/query/useProductRatings";
import Loading from "../../containers/Loading";

const ProductReviews = ({ product }) => {
  const navigate = useNavigate();
  const { data: user } = useLoginCheck();
  const [showOptions, setShowOptions] = useState(false);

  const { ToastContainer, showErrorMessage } = Toastify();

  const { _id: id, rate, rateCount } = product;

  const rateValue = Math.floor(rate);
  let fraction = rate - rateValue;
  fraction = parseFloat(fraction.toFixed(2));

  const {
    isLoading: isLoadingRatings,
    error: errorRatings,
    data,
    refetch,
  } = useProductRatings(id);

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

  const productRatings = data?.pages.flat(Infinity);

  const handleDelete = async (id) => {
    try {
      await deleteReq("/ratings", { id });
      refetch();
    } catch (error) {
      showErrorMessage({ message: error.message });
    }
  };

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
          </div>

          {/* MARK: USER RATINGS */}
          <main className="flex-1 border">
            {productRatings.length === 0 ? (
              <div className="w-full h-96 flex justify-center items-center">
                No Reviews yet
              </div>
            ) : (
              <div className="">
                {productRatings.map((review, i) => {
                  const {
                    _id,
                    title,
                    comment,
                    rate,
                    user: { _id: userId, name, photo },
                  } = review;

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
                        {userId === user._id && (
                          <div className="relative">
                            <button
                              className="p-2"
                              onClick={() => setShowOptions((prev) => !prev)}
                            >
                              {showOptions ? (
                                <Icons.cancel />
                              ) : (
                                <Icons.options />
                              )}
                            </button>
                            {showOptions && (
                              <div className="absolute top-full right-0 border bg-white">
                                <p
                                  className="px-5 py-2 border-b cursor-pointer"
                                  onClick={() =>
                                    navigate(`/ratings/update/${_id}/${id}`)
                                  }
                                >
                                  Update
                                </p>
                                <p
                                  className="px-5 py-2  cursor-pointer"
                                  onClick={() => handleDelete(_id)}
                                >
                                  Delete
                                </p>
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
