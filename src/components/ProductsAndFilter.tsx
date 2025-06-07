import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import FilterSection from "./FilterSection";
import ProductGrid from "./ProductGrid";
import { PRODUCT } from "@/types";

type Props = {
  products: PRODUCT[];
  isPagination?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  fetchNextPage: () => void;
  id?: string;
};

type SORT_OPTION = "popularity" | "low_to_high" | "high_to_low";

const ProductsAndFilter = ({
  products,
  isPagination = false,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  id,
}: Props) => {
  const [sortOption, setSortOption] = useState<SORT_OPTION>("popularity");

  const [filterProducts, setFilterProducts] = useState<PRODUCT[]>([]);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    setFilterProducts([]);
  }, [id]);

  useEffect(() => {
    if (isPagination && inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, isFetchingNextPage, hasNextPage, fetchNextPage, isPagination]);

  const filterProductsFn = (products: PRODUCT[]) => {
    setFilterProducts(products);
  };

  return (
    <>
      <section className="w-full h-full flex gap-2 bg-gray-100 p-2 relative">
        <div
          className="w-64 lg:w-56 md:w-48 hidden md:flex border-r-2 sticky top-[88px] bg-white"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <FilterSection
            id={id}
            products={products}
            filterProductsFn={filterProductsFn}
          />
        </div>

        <main className="flex-1 bg-white">
          {filterProducts?.length > 0 ? (
            <ProductGrid
              products={filterProducts}
              sortOption={sortOption}
              setSortOption={setSortOption}
            />
          ) : products.length > 0 ? (
            <div>
              <ProductGrid
                products={products}
                sortOption={sortOption}
                setSortOption={setSortOption}
              />
              {isFetchingNextPage && (
                <div className="text-gray-600 animate-pulse">
                  Loading more products...
                </div>
              )}
              <div
                ref={ref}
                style={{ minHeight: 50 }}
                className="flex justify-center py-4"
              />
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
