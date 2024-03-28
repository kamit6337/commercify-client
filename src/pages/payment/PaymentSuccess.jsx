import { useSearchParams } from "react-router-dom";
import useBuyProducts from "../../hooks/query/useBuyProducts";
import Loading from "../../containers/Loading";

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

  return (
    <div>
      <p>Payment Success</p>
      <p>{JSON.stringify(data)}</p>
    </div>
  );
};

export default PaymentSuccess;
