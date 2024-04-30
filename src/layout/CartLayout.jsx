import { Link, Outlet } from "react-router-dom";
import PriceList from "../components/PriceList";
import { useSelector } from "react-redux";
import { localStorageState } from "../redux/slice/localStorageSlice";
import { Helmet } from "react-helmet";

const CartLayout = () => {
  const { cart } = useSelector(localStorageState);
  const cartIds = cart.map((obj) => obj.id);

  if (cartIds.length === 0) {
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
      <main className="flex items-start tablet:flex-col gap-5">
        <div className="flex-1">
          <Outlet />
        </div>
        <div className="bg-white w-96 sm_lap:w-80 tablet:w-full sticky top-[100px]">
          <PriceList />
        </div>
      </main>
    </section>
  );
};

export default CartLayout;
