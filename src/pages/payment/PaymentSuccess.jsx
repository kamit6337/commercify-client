import { Link, useSearchParams } from "react-router-dom";
import useBuyProducts from "../../hooks/query/useBuyProducts";
import Loading from "../../containers/Loading";
import Product from "./Product";

const PaymentSuccess = () => {
  const searchParams = useSearchParams()[0].get("token");
  const { isLoading, error, data } = useBuyProducts(searchParams);

  if (isLoading) {
    return (
      <div className="h-96 w-full">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 w-full flex justify-center items-center">
        <p>{error}</p>
      </div>
    );
  }

  const { products: buyProducts } = data;

  return (
    <section className="bg-gray-100 p-5">
      <main className="bg-white">
        <div className="p-5 flex items-center justify-between">
          <div>
            <p className="text-2xl tablet:text-lg font-semibold tracking-wide">
              Payment is successful
            </p>
            <p className="tablet:text-xs">Your orders has been created</p>
          </div>
          <Link to={`/`}>
            <div className="px-20 tablet:px-10 py-3 bg-orange-500 text-white rounded-md">
              Continue Shopping
            </div>
          </Link>
        </div>
        {buyProducts.length > 0 ? (
          buyProducts.map((buyProduct, i) => {
            return (
              <div key={i}>
                <Product buyProduct={buyProduct} />
              </div>
            );
          })
        ) : (
          <div>Error Occur.</div>
        )}
      </main>
    </section>
  );
};

export default PaymentSuccess;
