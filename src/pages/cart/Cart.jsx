import { useSelector } from "react-redux";
import { localStorageState } from "../../redux/slice/localStorageSlice";
import Products from "./Products";
import { Helmet } from "react-helmet";

const Cart = () => {
  const { cart } = useSelector(localStorageState);

  return (
    <>
      <Helmet>
        <title>Cart</title>
        <meta name="description" content={`Cart of Commercify App`} />
      </Helmet>

      <section className="">
        <p className="py-5 px-10 text-xl">
          My Cart <span className="text-sm">({cart.length})</span>
        </p>
        {cart.length > 0 ? (
          <div>
            <Products list={cart} />
          </div>
        ) : (
          <div>No Cart</div>
        )}
        <div className="flex justify-end py-3 px-10 sticky bottom-0 place_order_box bg-white">
          <p className="py-4 px-16 rounded-md bg-orange-400 text-white font-semibold tracking-wide cursor-pointer">
            Placed Order
          </p>
        </div>
      </section>
    </>
  );
};

export default Cart;
