/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import Loading from "../../containers/Loading";
import useCategoryProducts from "../../hooks/query/useCategoryProducts";
import changePriceDiscountByExchangeRate from "../../utils/javascript/changePriceDiscountByExchangeRate";
import { useSelector } from "react-redux";
import { currencyState } from "../../redux/slice/currencySlice";
import { Icons } from "../../assets/icons";
import { useLayoutEffect, useRef, useState } from "react";

const CategoryProducts = ({ category, productId }) => {
  const { symbol, exchangeRate } = useSelector(currencyState);
  const { _id, title } = category;

  const { isLoading, error, data } = useCategoryProducts(_id);

  const scrollPixel = 500;
  const ref = useRef(null);
  const [widthDiff, setWidthDiff] = useState(null);
  const [index, setIndex] = useState(0);

  useLayoutEffect(() => {
    if (ref.current) {
      const width = ref.current.clientWidth;
      const scrollWidth = ref.current.scrollWidth;
      setWidthDiff(scrollWidth - width);
    }
  }, [data]);

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

  const moveRight = () => {
    if (!widthDiff || widthDiff <= 0) return;
    if (widthDiff >= scrollPixel) {
      setIndex((prev) => prev - scrollPixel);
      setWidthDiff((prev) => prev - scrollPixel);
      return;
    }

    setIndex((prev) => prev - widthDiff);
    setWidthDiff((prev) => prev - widthDiff);
  };

  const moveLeft = () => {
    if (!index || index >= 0) return;

    const positiveIndex = index * -1;

    if (positiveIndex >= scrollPixel) {
      setIndex((prev) => prev + scrollPixel);
      setWidthDiff((prev) => prev + scrollPixel);
      return;
    }
    setIndex((prev) => prev + positiveIndex);
    setWidthDiff((prev) => prev + positiveIndex);
  };

  const products = data.data.filter((obj) => obj._id !== productId);

  return (
    <section className="my-20 tablet:my-10">
      <p className="mx-10 text-xl ">
        Suggested Products from Category :{" "}
        <span className="text-2xl font-semibold tracking-wide capitalize">
          {title}
        </span>
      </p>
      <div className="flex items-center h-[400px] my-10 relative">
        <div className="relative flex-1 flex mx-10 tablet:mx-5" ref={ref}>
          <div
            className="absolute h-full flex items-center gap-5 duration-500"
            style={{ transform: `translateX(${index}px)` }}
          >
            {products.map((product, i) => {
              const {
                _id,
                title,
                description,
                price,
                discountPercentage,
                category,
                thumbnail,
              } = product;

              const { discountedPrice } = changePriceDiscountByExchangeRate(
                price,
                discountPercentage,
                exchangeRate
              );

              return (
                <div
                  key={i}
                  className="shrink-0 grow-0 w-80 laptop:w-64 sm_lap:w-52 tablet:w-52 h-96 laptop:h-80 flex flex-col rounded-xl hover:shadow-2xl duration-200"
                >
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
                      <p className="text-lg font-semibold tracking-wide truncate tablet:text-base">
                        {title}
                      </p>
                      <p className="text-[13px] line-clamp-2 mt-1 tablet:line-clamp-2 tablet:text-xs">
                        {description}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="tablet:text-sm">
                        <Link to={`/category/${category._id}`}>
                          {category.title}
                        </Link>
                      </p>
                      <p>
                        {symbol}
                        {discountedPrice}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <p
          className="absolute h-full left-0  hover:text-4xl duration-300 cursor-pointer  flex items-center px-1 tablet:px-0 text-slate-800 text-3xl"
          onClick={moveLeft}
        >
          <Icons.leftArrow />
        </p>
        <p
          className="absolute h-full right-0 hover:text-4xl duration-300 cursor-pointer  flex items-center px-1 tablet:px-0 text-slate-800 text-3xl"
          onClick={moveRight}
        >
          <Icons.rightArrow />
        </p>
      </div>
    </section>
  );
};

export default CategoryProducts;
