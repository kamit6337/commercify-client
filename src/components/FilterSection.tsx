import { Link, useLocation } from "react-router-dom";
import { useMemo } from "react";
import useAllCategory from "@/hooks/category/useAllCategory";
import { CATEGORY, PRODUCT } from "@/types";
import RangeSliderWithTooltip from "@/lib/RangeSliderWithTooltip";

type Props = {
  products: PRODUCT[];
  filterProductsFn: (value: PRODUCT[]) => void;
  id?: string;
};

const FilterSection = ({ id, products, filterProductsFn }: Props) => {
  const { pathname } = useLocation();
  const { data: allCategory } = useAllCategory();

  const { maxPrice, minPrice } = useMemo(() => {
    const discountedPriceList = products.map(
      (product) => product.price.discountedPrice
    );

    const maxValue = Math.max(...discountedPriceList);
    const minValue = Math.min(...discountedPriceList);

    return {
      maxPrice: maxValue + 1,
      minPrice: minValue + 1,
    };
  }, [products]);

  const handlePriceChange = (value: number) => {
    const filter = products.filter((product) => {
      const { discountedPrice } = product.price;

      return discountedPrice <= value;
    });
    filterProductsFn(filter);
  };

  return (
    <section className="flex flex-col h-full w-full">
      <p className="border-b p-4 font-semibold tracking-wide  text-lg  text-important_black">
        Filters
      </p>
      <div className="py-8 p-4 flex flex-col gap-2 border-b">
        <div className="uppercase tracking-wide text-sm flex justify-between items-center">
          <p>Price</p>
        </div>

        <div className="">
          <RangeSliderWithTooltip
            id={id}
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
                      <p
                        className={`${
                          pathname === "/" ? "text-blue-600" : ""
                        } text-sm capitalize`}
                      >
                        All
                      </p>
                    </Link>
                  </div>
                  {allCategory.map((category: CATEGORY, i: number) => {
                    const { _id, title } = category;

                    return (
                      <div key={i} className="cursor-pointer py-2 ">
                        <Link to={`/category/${_id}`}>
                          <p
                            className={`${
                              _id === id ? "text-blue-600" : ""
                            } text-sm capitalize`}
                          >
                            {title}
                          </p>
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
