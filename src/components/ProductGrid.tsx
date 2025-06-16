import { useMemo } from "react";
import ProductCard from "./ProductCard";
import { PRODUCT } from "@/types";

type SORT_OPTION = "popularity" | "low_to_high" | "high_to_low";

type Props = {
  products: PRODUCT[];
  sortOption: SORT_OPTION;
  setSortOption: (value: SORT_OPTION) => void;
};

const ProductGrid = ({ products, sortOption, setSortOption }: Props) => {
  const sortedProducts = useMemo(() => {
    if (sortOption === "popularity") {
      return products;
    }

    const cloned = [...products];
    cloned.sort((a, b) => {
      const priceA = a.price.discountedPrice ?? 0;
      const priceB = b.price.discountedPrice ?? 0;

      if (sortOption === "low_to_high") return priceA - priceB;
      if (sortOption === "high_to_low") return priceB - priceA;
      return 0;
    });

    return cloned;
  }, [products, sortOption]);

  return (
    <section>
      <div className="w-full h-10 border-b px-4 text-sm  flex items-center gap-5">
        <p className="font-semibold text-important_black">Sort By</p>
        <p
          className={`${
            sortOption === "popularity" &&
            "border-b-2 text-blue-600 border-blue-600"
          } cursor-pointer  h-full flex items-center`}
          onClick={() => setSortOption("popularity")}
        >
          Popularity
        </p>
        <p
          className={`${
            sortOption === "low_to_high" &&
            "border-b-2 text-blue-600 border-blue-600"
          } cursor-pointer  h-full flex items-center`}
          onClick={() => setSortOption("low_to_high")}
        >
          Price - Low to High
        </p>
        <p
          className={`${
            sortOption === "high_to_low" &&
            "border-b-2 text-blue-600 border-blue-600"
          } cursor-pointer  h-full flex items-center`}
          onClick={() => setSortOption("high_to_low")}
        >
          Price - High to Low
        </p>
      </div>
      <div className="py-10 w-full grid md:grid-cols-3 grid-cols-2 justify-items-center lg:gap-y-8 gap-y-6  ">
        {sortedProducts.map((product) => {
          return <ProductCard key={product._id} product={product} />;
        })}
      </div>
    </section>
  );
};

export default ProductGrid;
