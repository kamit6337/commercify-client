import { useSearchParams } from "react-router-dom";
import useAllProducts from "../../hooks/query/useAllProducts";
import ProductGrid from "../../components/ProductGrid";
import { useState } from "react";
import { Helmet } from "react-helmet";
import FilterSection from "../../components/FilterSection";
import { useEffect } from "react";

const SearchProducts = () => {
  const [searchParams] = useSearchParams();
  const queryString = searchParams.get("q");
  const { data } = useAllProducts();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!queryString || !data) {
      setProducts([]);
      return;
    }

    const filterProducts = data.data.filter((product) =>
      product.title.toLowerCase().includes(queryString.toLowerCase())
    );
    setProducts(filterProducts);
  }, [data, queryString]);

  const filterProducts = (products) => {
    setProducts(products);
  };

  return (
    <>
      <Helmet>
        <title>Search-{queryString}</title>
        <meta name="description" content="An e-Commerce App" />
      </Helmet>

      <section className="w-full h-full flex gap-2 bg-gray-100 p-2 ">
        <div
          className="w-64 border-r-2 sticky top-[88px] bg-white"
          style={{ height: "calc(100vh - 100px)" }}
        >
          <FilterSection products={data.data} filterProducts={filterProducts} />
        </div>
        <main className="flex-1 bg-white">
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl font-semibold">
              Sorry, no product available
            </div>
          )}
        </main>
      </section>
    </>
  );
};

export default SearchProducts;
