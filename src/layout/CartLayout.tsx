import { Link, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { cartAndWishlistState } from "@/redux/slice/cartAndWishlistSlice";
import useProductsFromIDs from "@/hooks/products/useProductsFromIDs";
import Loading from "@/lib/Loading";
import useUserAddress from "@/hooks/address/useUserAddress";
import PriceList from "@/components/PriceList";

const CartLayout = () => {
  const { cart } = useSelector(cartAndWishlistState);
  const cartIds = cart.map((obj) => obj.id);
  const { isLoading, error, data } = useProductsFromIDs(cartIds);
  const {
    isLoading: isLoadingUserAddress,
    error: errorUserAddress,
    data: userAddresses,
  } = useUserAddress();

  if (isLoading || isLoadingUserAddress) {
    return <Loading />;
  }

  if (error || errorUserAddress) {
    return <div>{error || errorUserAddress?.message}</div>;
  }

  if (!cart || cart.length === 0) {
    return (
      <>
        <Helmet>
          <title>Empty Cart</title>
        </Helmet>
        <div
          className="p-5 bg-gray-100 "
          style={{ height: "calc(100vh - 180px)" }}
        >
          <div className="bg-white w-full h-full flex flex-col gap-4 justify-center items-center">
            <p className="text-lg">Your cart is empty!</p>
            <Link to={`/`}>
              <p className="bg-blue-500 py-3 px-20 text-sm text-white rounded-md">
                Shop Now
              </p>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <section className="p-5 sm_lap:px-2 bg-gray-100">
      <main className="flex items-start tablet:items-stretch tablet:flex-col gap-5">
        <div className="flex-1">
          <Outlet
            context={{
              products: data,
              addresses: userAddresses,
              cart,
              cartIds,
            }}
          />
        </div>
        <div className="bg-white w-96 sm_lap:w-80 tablet:w-full sticky top-[100px]">
          <PriceList products={data} addresses={userAddresses} cart={cart} />
        </div>
      </main>
    </section>
  );
};

export default CartLayout;
