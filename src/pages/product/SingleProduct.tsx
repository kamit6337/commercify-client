import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { currencyState } from "../../redux/slice/currencySlice";
import { PARAMS, PRODUCT } from "@/types";
import useSingleProduct from "@/hooks/products/useSingleProduct";
import Loading from "@/lib/Loading";
import makeDateDaysAfter from "@/utils/javascript/makeDateDaysAfter";
import CategoryProducts from "./CategoryProducts";
import ProductReviews from "./ProductReviews";
import ImagePart from "./ImagePart";
import { saleAndStockState } from "@/redux/slice/saleAndStockSlice";

const SingleProduct = () => {
  const { id } = useParams() as PARAMS;
  const { symbol } = useSelector(currencyState);
  const { isLoading, error, data } = useSingleProduct(id);
  const { zeroStock, notReadyToSale } = useSelector(saleAndStockState);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [id]);

  const isProductOutOfStock = useMemo(() => {
    return zeroStock.includes(id);
  }, [id, zeroStock]);

  const noSale = useMemo(() => {
    return notReadyToSale.includes(id);
  }, [id, notReadyToSale]);

  if (isLoading) {
    return <Loading />;
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
    price: { discountPercentage, price, discountedPrice },
    category,
    deliveredBy,
    thumbnail,
  } = data as PRODUCT;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>

      <main>
        <section className="flex md:flex-row flex-col gap-5 py-16 section_padding">
          <div className="flex-1 md:w-3/5 w-full">
            <div className="border w-full h-96 flex justify-center py-2 rounded">
              <img
                src={thumbnail}
                alt={title}
                className="h-full object-cover"
              />
            </div>
            <ImagePart
              id={id}
              isProductOutOfStock={isProductOutOfStock}
              noSale={noSale}
            />
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <div>
              <p className="text-xl font-semibold text-important_text">
                {title}
              </p>
              <p className="text-xs mt-2">{description}</p>
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
                  {price}
                </p>
                <p className="text-xs">{discountPercentage}% Off</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <p>Delivery by </p>
              <p>-</p>
              <p className="text-important_text">
                {makeDateDaysAfter(deliveredBy)}
              </p>
            </div>
            {isProductOutOfStock && (
              <div>
                <p className="text-red-500 text-lg font-semibold tracking-wider">
                  Sorry Product Unavailable. Out of stock.
                </p>
                <p className="text-gray-400">
                  Click Notify me to send Notification when comes to stock.
                </p>
              </div>
            )}
            {noSale && (
              <div>
                <p className="text-red-500 text-lg font-semibold tracking-wider">
                  Sorry Product currently out of sale.
                </p>
                <p className="text-gray-400">
                  Click Notify me to send Notification when ready to sale.
                </p>
              </div>
            )}
          </div>
        </section>
        <CategoryProducts category={category} productId={id} />
        <ProductReviews product={data} />
      </main>
    </>
  );
};

export default SingleProduct;
