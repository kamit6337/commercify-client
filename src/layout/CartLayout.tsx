import { Link, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { cartAndWishlistState } from "@/redux/slice/cartAndWishlistSlice";
import useProductsFromIDs from "@/hooks/products/useProductsFromIDs";
import Loading from "@/lib/Loading";
import useUserAddress from "@/hooks/address/useUserAddress";
import PriceList from "@/components/PriceList";

const CartLayout = () => {
  const { pathname } = useLocation();
  const { cart } = useSelector(cartAndWishlistState);
  const cartIds = cart.map((obj) => obj.id);
  const { isLoading, error, data = [] } = useProductsFromIDs(cartIds);

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
        <div className="p-5 bg-bg_bg" style={{ height: "calc(100vh - 180px)" }}>
          <div className="bg-background w-full h-full flex flex-col gap-4 justify-center items-center">
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
    <section className="py-3 lg:px-5 px-3 bg-bg_bg">
      <main className="flex lg:gap-5 gap-3">
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
        {pathname === "/cart/address" || (
          <div className="bg-background self-start lg:w-96 md:w-80 w-full sticky top-[92px] hidden md:flex">
            <PriceList products={data} />
          </div>
        )}
      </main>
    </section>
  );
};

export default CartLayout;
