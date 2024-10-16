import { Link, useSearchParams } from "react-router-dom";
import useBuyProducts from "../../hooks/query/useBuyProducts";
import Loading from "../../containers/Loading";
import Product from "./Product";

const PaymentSuccess = () => {
  const sessionId = useSearchParams()[0].get("sessionId");

  const { isLoading, error, data } = useBuyProducts(sessionId);

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
        <p>{error.message}</p>
      </div>
    );
  }

  const buyProducts = data.data;
  buyProducts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (buyProducts.length === 0) {
    return (
      <div className="h-96 w-full flex flex-col justify-center items-center">
        <p>Error Occur</p>
        <p>Try refresh the page</p>
      </div>
    );
  }

  return (
    <section className="bg-gray-100 p-5">
      <main className="bg-white">
        <div className="p-5 flex items-center justify-between border-b">
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
