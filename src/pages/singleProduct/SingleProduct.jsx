import { Link, useParams } from "react-router-dom";
import Loading from "../../containers/Loading";
import useSingleProduct from "../../hooks/query/useSingleProduct";
import ImagePart from "../../components/ImagePart";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { currencyState } from "../../redux/slice/currencySlice";
import CategoryProducts from "./CategoryProducts";
import ProductReviews from "./ProductReviews";
import useProductRatings from "../../hooks/query/useProductRatings";

const SingleProduct = () => {
  const { id } = useParams();
  const { symbol, exchangeRate } = useSelector(currencyState);

  const { isLoading, error, data } = useSingleProduct(id);
  const { isLoading: isLoadingRatings, error: errorRatings } =
    useProductRatings(id);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [id]);

  if (isLoading || isLoadingRatings) {
    return (
      <div className="w-full h-96">
        <Loading />
      </div>
    );
  }

  if (error || errorRatings) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        {error?.message || errorRatings?.message}
      </div>
    );
  }

  const { title, description, price, category, images, discountPercentage } =
    data.data;

  const exchangeRatePrice = Math.round(price * exchangeRate);
  const roundDiscountPercent = Math.round(discountPercentage);
  const discountedPrice = Math.round(
    (exchangeRatePrice * (100 - roundDiscountPercent)) / 100
  );

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>

      <main>
        <section className="grid grid-cols-2 tablet:inline-flex gap-5 py-16 px-6 tablet:px-2">
          <div className="tablet:w-3/5">
            <ImagePart images={images} title={title} id={id} />
          </div>

          <div className="flex flex-col gap-4 tablet:w-2/5">
            <div>
              <p className="text-xl font-semibold">{title}</p>
              <p className="text-xs">{description}</p>
            </div>
            <p className="text-sm">
              <Link to={`/category/${category._id}`}>
                Category : {category.title}
              </Link>
            </p>
            <div>
              <p className="text-xs text-green-700 font-semibold tracking-wide">
                Special Price
              </p>
              <div className="flex gap-2 items-center">
                <p className="text-2xl font-semibold tracking-wide">
                  {symbol}
                  {discountedPrice}
                </p>
                <p className="line-through">
                  {symbol}
                  {exchangeRatePrice}
                </p>
                <p className="text-xs">{roundDiscountPercent}% Off</p>
              </div>
            </div>
          </div>
        </section>
        <CategoryProducts category={category} />
        <ProductReviews id={id} />
      </main>
    </>
  );
};

export default SingleProduct;
