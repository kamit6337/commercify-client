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
import makeDateDaysAfter from "../../utils/javascript/makeDateDaysAfter";
import changePriceDiscountByExchangeRate from "../../utils/javascript/changePriceDiscountByExchangeRate";

const SingleProduct = () => {
  const { id } = useParams();
  const { symbol, exchangeRate } = useSelector(currencyState);

  const { isLoading, error, data } = useSingleProduct(id);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [id]);

  if (isLoading) {
    return (
      <div className="w-full h-96">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        {error?.message}
      </div>
    );
  }

  const {
    title,
    description,
    price,
    category,
    images,
    discountPercentage,
    deliveredBy,
  } = data.data;

  const { discountedPrice, exchangeRatePrice, roundDiscountPercent } =
    changePriceDiscountByExchangeRate(price, discountPercentage, exchangeRate);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>

      <main>
        <section className="flex tablet:inline-flex mobile:flex-col gap-5 py-16 section_padding">
          <div className="flex-1 tablet:w-3/5 mobile:w-full">
            <ImagePart images={images} title={title} id={id} />
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <div>
              <p className="text-xl font-semibold text-important_text">
                {title}
              </p>
              <p className="text-xs">{description}</p>
            </div>
            <p className="text-sm text-gray-500 text-some_less_important_text capitalize">
              <Link to={`/category/${category._id}`}>
                Category :{" "}
                <span className="font-semibold tracking-wider">
                  {category.title}
                </span>
              </Link>
            </p>
            <div>
              <p className="text-xs text-green-700 font-semibold tracking-wide">
                Special Price
              </p>
              <div className="flex gap-2 items-center">
                <p className="text-2xl font-semibold tracking-wide text-important_text">
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
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <p>Delivery by </p>
              <p>-</p>
              <p className="text-important_text">
                {makeDateDaysAfter(deliveredBy)}
              </p>
            </div>
          </div>
        </section>
        <CategoryProducts category={category} productId={id} />
        <ProductReviews id={id} />
      </main>
    </>
  );
};

export default SingleProduct;
