import { useSelector } from "react-redux";
import { localStorageState } from "../../redux/slice/localStorageSlice";
import Products from "./Products";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart } = useSelector(localStorageState);
  const cartIds = cart.map((obj) => obj.id);

  return (
    <>
      <Helmet>
        <title>Cart</title>
        <meta name="description" content={`Cart of Commercify App`} />
      </Helmet>

      <section className="bg-white">
        <p className="py-5 px-10 text-xl border-b">
          My Cart <span className="text-sm">({cartIds.length})</span>
        </p>
        {cartIds.length > 0 ? (
          <div>
            <Products list={cartIds} />
          </div>
        ) : (
          <div>No Cart</div>
        )}
        <div className="flex justify-end py-3 px-10 sticky bottom-0 place_order_box bg-white">
          <button className="py-4 px-16 rounded-md bg-orange-400 text-white font-semibold tracking-wide">
            <Link to={`/cart/address`}>Placed Order</Link>
          </button>
        </div>
      </section>
    </>
  );
};

export default Cart;
