import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { PRODUCT } from "@/types";
import { useSelector } from "react-redux";
import { currencyState } from "@/redux/slice/currencySlice";

type Props = {
  products: PRODUCT[];
};

const ProductGrid = ({ products }: Props) => {
  const [defaultSort, setDefaultSort] = useState(1);
  const [sortProducts, setSortProducts] = useState(products);
  const { currency_code } = useSelector(currencyState);

  useEffect(() => {
    if (!products) return;

    if (defaultSort === 1) {
      const beforeSort = [...products];
      beforeSort.sort((a, b) => {
        console.log(
          "a.price[currency_code].exchangeRatePrice",
          a.price[currency_code].exchangeRatePrice
        );
        console.log(
          "b.price[currency_code].exchangeRatePrice",
          b.price[currency_code].exchangeRatePrice
        );

        return (
          a.price[currency_code].exchangeRatePrice -
          b.price[currency_code].exchangeRatePrice
        );
      });

      setSortProducts(beforeSort);
      return;
    }

    if (defaultSort === 2) {
      const beforeSort = [...products];
      beforeSort.sort((a, b) => {
        return (
          b.price[currency_code].exchangeRatePrice -
          a.price[currency_code].exchangeRatePrice
        );
      });

      setSortProducts(beforeSort);
    }
  }, [defaultSort, products]);

  const handleLowToHigh = () => {
    const beforeSort = [...products];
    beforeSort.sort((a, b) => {
      console.log(
        "a.price[currency_code].exchangeRatePrice",
        a.price[currency_code].exchangeRatePrice
      );
      console.log(
        "b.price[currency_code].exchangeRatePrice",
        b.price[currency_code].exchangeRatePrice
      );

      return (
        a.price[currency_code].exchangeRatePrice -
        b.price[currency_code].exchangeRatePrice
      );
    });

    setSortProducts(beforeSort);
  };
  return (
    <section>
      <div className="w-full h-10 border-b px-4 text-sm  flex items-center gap-5">
        <p className="font-semibold text-important_black">Sort By</p>
        <p
          className={`${
            defaultSort === 1 && "border-b-2 text-blue-600 border-blue-600"
          } cursor-pointer  h-full flex items-center`}
          onClick={() => handleLowToHigh()}
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
      <div className="py-10 w-full grid md:grid-cols-3 grid-cols-2 justify-items-center lg:gap-y-8 gap-y-6  ">
        {sortProducts.map((product) => {
          return <ProductCard key={product._id} product={product} />;
        })}
      </div>
    </section>
  );
};

export default ProductGrid;
