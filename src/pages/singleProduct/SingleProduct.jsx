import { Link, useParams } from "react-router-dom";
import Loading from "../../containers/Loading";
import useSingleProduct from "../../hooks/query/useSingleProduct";
import ImagePart from "../../components/ImagePart";
import { Helmet } from "react-helmet";

const SingleProduct = () => {
  const { id } = useParams();

  const { isLoading, isError, error, data } = useSingleProduct(id);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

  const { title, description, price, category, images, discountPercentage } =
    data.data;

  const roundDiscountPercent = Math.round(discountPercentage);

  const discountedPrice = Math.round(
    (price * (100 - roundDiscountPercent)) / 100
  );

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>

      <section className="grid grid-cols-2 gap-5 py-16 px-6">
        <div className="">
          <ImagePart images={images} title={title} id={id} />
        </div>

        <div className="flex flex-col gap-4">
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
                ${discountedPrice}
              </p>
              <p className="line-through">${price}</p>
              <p className="text-xs">{roundDiscountPercent}% Off</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SingleProduct;
