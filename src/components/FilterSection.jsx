/* eslint-disable react/prop-types */

import findMaxPrice from "../utils/javascript/findMaxPrice";
import useAllCategory from "../hooks/query/useAllCategory";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { currencyState } from "../redux/slice/currencySlice";
import RangeSliderWithTooltip from "../lib/RangeSliderWithTooltip";
import { useMemo } from "react";

const FilterSection = ({ products, filterProductsFn }) => {
  const { data: allCategory } = useAllCategory();
  const { exchangeRate } = useSelector(currencyState);

  const { maxPrice, minPrice } = useMemo(() => {
    return findMaxPrice(products, exchangeRate);
  }, [products, exchangeRate]);

  const handlePriceChange = (value) => {
    const filter = products.filter((product) => {
      const exchangeRatePrice = Math.round(product.price * exchangeRate);

      const roundDiscountPercent = Math.round(product.discountPercentage);
      const discountedPrice = Math.round(
        (exchangeRatePrice * (100 - roundDiscountPercent)) / 100
      );

      return discountedPrice <= value;
    });
    filterProductsFn(filter);
  };

  return (
    <section className="flex flex-col h-full">
      <p className="border-b p-4 font-semibold tracking-wide  text-lg  text-important_black">
        Filters
      </p>
      <div className="py-8 p-4 flex flex-col gap-2 border-b">
        <div className="uppercase tracking-wide text-sm flex justify-between items-center">
          <p>Price</p>
        </div>

        <div className="">
          {/* <Box>
            <Slider
              aria-label="Temperature"
              defaultValue={maxPrice}
              valueLabelDisplay="auto"
              step={Math.floor(maxPrice / 6) + 1}
              marks={false}
              size="small"
              min={0}
              max={maxPrice}
              onChange={handlePriceChange}
            />
          </Box> */}
          <RangeSliderWithTooltip
            maxPrice={maxPrice}
            minPrice={minPrice}
            handlePriceChange={handlePriceChange}
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-2 p-4 pr-0">
        <p className="uppercase text-sm tracking-wide font-semibold">
          Categories
        </p>
        <div className="flex-1 relative">
          <div className="absolute z-10 top-0 w-full h-full">
            <div className="h-full overflow-x-auto ">
              {allCategory.length > 0 ? (
                <>
                  <div className="cursor-pointer py-2">
                    <Link to={`/`}>
                      <p className="text-sm capitalize">All</p>
                    </Link>
                  </div>
                  {allCategory.map((category, i) => {
                    const { _id, title } = category;

                    return (
                      <div key={i} className="cursor-pointer py-2 ">
                        <Link to={`/category/${_id}`}>
                          <p className="text-sm capitalize">{title}</p>
                        </Link>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div>No Category available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilterSection;
