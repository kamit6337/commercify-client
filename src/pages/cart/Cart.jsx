import { useSelector } from "react-redux";
import { localStorageState } from "../../redux/slice/localStorageSlice";
import Products from "./Products";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Cart = () => {
  const { cart } = useSelector(localStorageState);
  const cartIds = cart.map((obj) => obj.id);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

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
        <div className="flex justify-end py-3 px-10 sticky bottom-0 place_order_box bg-white tablet:hidden">
          <Link to={`/cart/address`}>
            <button className="py-4 px-16 rounded-md bg-orange-400 text-white font-semibold tracking-wide">
              Placed Order
            </button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Cart;
