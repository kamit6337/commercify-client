/* eslint-disable react/prop-types */
import { Box, Slider } from "@mui/material";
import findMaxPrice from "../utils/javascript/findMaxPrice";
import { useState } from "react";

const FilterSection = ({ products, filterProducts }) => {
  const [maxPrice, setMaxprice] = useState(findMaxPrice(products));
  const [showClearAll, setShowClearAll] = useState(false);

  const handlePriceChange = (event, value) => {
    if (value < maxPrice) {
      setShowClearAll(true);
    } else {
      setShowClearAll(false);
    }

    const filter = products.filter((product) => {
      const roundDiscountPercent = Math.round(product.discountPercentage);
      const discountedPrice = Math.round(
        (product.price * (100 - roundDiscountPercent)) / 100
      );

      return discountedPrice <= value;
    });
    filterProducts(filter);
  };

  return (
    <section className="">
      <p className="border-b p-4 font-semibold tracking-wide  text-lg">
        Filters
      </p>
      <div className="py-8 p-4 flex flex-col gap-2 border-b">
        <div className="uppercase tracking-wide text-sm flex justify-between items-center">
          <p>Price</p>
          {showClearAll && (
            <p
              className="text-xs cursor-pointer"
              onClick={() => setMaxprice(maxPrice)}
            >
              Clear All
            </p>
          )}
        </div>

        <div className="">
          <Box>
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
          </Box>
        </div>
      </div>
    </section>
  );
};

export default FilterSection;
