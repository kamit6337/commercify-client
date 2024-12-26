import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import FilterSection from "./FilterSection";
import ProductGrid from "./ProductGrid";
import { PRODUCT } from "@/types";

type Props = {
  products: PRODUCT[];
  isPagination?: boolean;
  isFetching?: boolean;
  fetchNextPage: () => void;
};

const ProductsAndFilter = ({
  products,
  isPagination = false,
  isFetching,
  fetchNextPage,
}: Props) => {
  const [filterProducts, setFilterProducts] = useState<PRODUCT[]>([]);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (isPagination && inView && !isFetching) {
      fetchNextPage();
    }
  }, [inView, isFetching, fetchNextPage, isPagination]);

  const filterProductsFn = (products: PRODUCT[]) => {
    setFilterProducts(products);
  };

  return (
    <>
      <section className="w-full h-full flex gap-2 bg-gray-100 p-2 relative">
        <div
          className="w-64 laptop:w-56 sm_lap:w-48 tablet:hidden border-r-2 sticky top-[88px] bg-white"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <FilterSection
            products={products}
            filterProductsFn={filterProductsFn}
          />
        </div>

        <main className="flex-1 bg-white">
          {filterProducts.length > 0 ? (
            <ProductGrid products={filterProducts} />
          ) : products.length > 0 ? (
            <div>
              <ProductGrid products={products} />
              <div ref={ref} />
            </div>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              Sorry, no product available
            </div>
          )}
        </main>
      </section>
    </>
  );
};

export default ProductsAndFilter;
