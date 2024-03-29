import { Helmet } from "react-helmet";
import ProductGrid from "../../components/ProductGrid";
import useAllProducts from "../../hooks/query/useAllProducts";
import { useEffect, useState } from "react";
import FilterSection from "../../components/FilterSection";

const Home = () => {
  const { data } = useAllProducts();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (data) {
      setProducts(data.data);
    }
  }, [data]);

  const filterProducts = (products) => {
    setProducts(products);
  };

  return (
    <>
      <Helmet>
        <title>Commercify</title>
        <meta name="description" content="An e-Commerce App" />
      </Helmet>

      <section className="w-full h-full flex gap-2 bg-gray-100 p-2 ">
        <div
          className="w-64 border-r-2 sticky top-[88px] bg-white"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <FilterSection products={data.data} filterProducts={filterProducts} />
        </div>
        <main className="flex-1 bg-white">
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div>Sorry, no product available</div>
          )}
        </main>
      </section>
    </>
  );
};

export default Home;
