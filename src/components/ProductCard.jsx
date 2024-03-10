/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const {
    _id,
    title,
    description,
    price,
    discountPercentage,
    stock,
    brand,
    category,
    thumbnail,
  } = product;

  return (
    <div className="w-80 h-96 flex flex-col rounded-xl hover:shadow-xl">
      <div className="w-full h-3/5">
        <Link to={`/products/${_id}`}>
          <img
            src={thumbnail}
            alt="product"
            loading="lazy"
            className="w-full h-full rounded-t-xl"
          />
        </Link>
      </div>
      <div className="flex-1 flex flex-col justify-between p-3 pb-4 pr-4">
        <p className="text-lg font-semibold tracking-wide">{title}</p>
        <div className="flex justify-between">
          <p>
            <Link to={`category/${category._id}`}>{category.title}</Link>
          </p>
          <p>{price}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
