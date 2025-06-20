import useSingleProduct from "@/hooks/products/useSingleProduct";
import Loading from "@/lib/Loading";
import { PARAMS, PRODUCT } from "@/types";
import { useParams } from "react-router-dom";
import AdminSingleProduct from "./products/AdminSingleProduct";

const SingleProductAdmin = () => {
  const { id } = useParams<PARAMS>();

  const { isLoading, error, data } = useSingleProduct(id as string);

  const product = data as PRODUCT;

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <div className="bg-bg_bg p-5">
      <div className="bg-background">
        <AdminSingleProduct product={product} />
      </div>
    </div>
  );
};

export default SingleProductAdmin;
