/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const {
    _id,
    title,
    description,
    price,
    discountPercentage,
    category,
    thumbnail,
  } = product;

  const roundDiscountPercent = Math.round(discountPercentage);

  const discountedPrice = Math.round(
    (price * (100 - roundDiscountPercent)) / 100
  );

  return (
    <div className="w-80 h-96 flex flex-col rounded-xl hover:shadow-2xl duration-200">
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
        <div>
          <p className="text-lg font-semibold tracking-wide truncate">
            {title}
          </p>
          <p className="text-[13px] line-clamp-2 mt-1">{description}</p>
        </div>
        <div className="flex justify-between">
          <p>
            <Link to={`/category/${category._id}`}>{category.title}</Link>
          </p>
          <p>${discountedPrice}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
