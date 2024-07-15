/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const returnDiscountedPrice = (product) => {
  const roundDiscountPercent = Math.round(product.discountPercentage);
  const discountedPrice = Math.round(
    (product.price * (100 - roundDiscountPercent)) / 100
  );
  return discountedPrice;
};

const ProductGrid = ({ products }) => {
  const [defaultSort, setDefaultSort] = useState(1);
  const [sortProducts, setSortProducts] = useState(products);

  useEffect(() => {
    if (!products) return;

    if (defaultSort === 1) {
      const beforeSort = [...products];
      beforeSort.sort((a, b) => {
        return returnDiscountedPrice(a) - returnDiscountedPrice(b);
      });

      setSortProducts(beforeSort);
      return;
    }

    if (defaultSort === 2) {
      const beforeSort = [...products];
      beforeSort.sort((a, b) => {
        return returnDiscountedPrice(b) - returnDiscountedPrice(a);
      });

      setSortProducts(beforeSort);
    }
  }, [defaultSort, products]);

  return (
    <section>
      <div className="w-full h-10 border-b px-4 text-sm  flex items-center gap-5">
        <p className="font-semibold text-important_black">Sort By</p>
        <p
          className={`${
            defaultSort === 1 && "border-b-2 text-blue-600 border-blue-600"
          } cursor-pointer  h-full flex items-center`}
          onClick={() => setDefaultSort(1)}
        >
          Price - Low to High
        </p>
        <p
          className={`${
            defaultSort === 2 && "border-b-2 text-blue-600 border-blue-600"
          } cursor-pointer  h-full flex items-center`}
          onClick={() => setDefaultSort(2)}
        >
          Price - High to Low
        </p>
      </div>
      <div className="py-10 w-full grid grid-cols-3 mobile:grid-cols-2 justify-items-center gap-y-8 laptop:gap-y-6  ">
        {sortProducts.map((product) => {
          return <ProductCard key={product.id} product={product} />;
        })}
      </div>
    </section>
  );
};

export default ProductGrid;
