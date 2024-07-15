/* eslint-disable react/prop-types */
import Loading from "../../containers/Loading";
import useCategoryProducts from "../../hooks/query/useCategoryProducts";
import ProductCard from "../../components/ProductCard";
import HorizontalScrolling from "../../lib/HorizontalScrolling";

const CategoryProducts = ({ category, productId }) => {
  const { _id, title } = category;

  const { isLoading, error, data } = useCategoryProducts(_id);

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
        {error.message}
      </div>
    );
  }

  const products = data.data.filter((obj) => obj._id !== productId);

  return (
    <section className="my-20 tablet:my-10">
      <p className="text-xl text-important_text section_padding">
        Suggested Products from Category :{" "}
        <span className="text-2xl font-semibold tracking-wide capitalize">
          {title}
        </span>
      </p>
      <HorizontalScrolling height={400}>
        {products.map((product, i) => {
          return <ProductCard key={i} product={product} />;
        })}
      </HorizontalScrolling>
    </section>
  );
};

export default CategoryProducts;
