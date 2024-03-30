import { useParams } from "react-router-dom";
import Loading from "../../containers/Loading";
import useCategoryProducts from "../../hooks/query/useCategoryProducts";
import ProductGrid from "../../components/ProductGrid";
import { Helmet } from "react-helmet";
import { useState } from "react";
import { useEffect } from "react";
import FilterSection from "../../components/FilterSection";

const CategoryProducts = () => {
  const { id } = useParams();

  const { isLoading, error, data } = useCategoryProducts(id);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (data) {
      setProducts(data.data);
    }
  }, [data]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [id]);

  if (isLoading) {
    return (
      <div className="w-full h-96">
        <Loading />
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        {error.message}
      </div>
    );
  }

  const filterProducts = (products) => {
    setProducts(products);
  };

  return (
    <>
      <Helmet>
        <title>Category</title>
        <meta name="description" content="Category products of this App" />
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
            <div className="w-full h-full flex justify-center items-center">
              Sorry, no product available
            </div>
          )}
        </main>
      </section>
    </>
  );
};

export default CategoryProducts;
