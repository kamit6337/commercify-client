import { Helmet } from "react-helmet";
import { Link, useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import Product from "./Product";
import { PRODUCT } from "@/types";

type OUTLET = {
  products: PRODUCT[];
};

const Cart = () => {
  const { products } = useOutletContext<OUTLET>();

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
          My Cart <span className="text-sm">({products.length})</span>
        </p>
        {products.length > 0 ? (
          <div>
            <div>
              {products.map((product) => {
                return <Product key={product._id} product={product} />;
              })}
            </div>
            <div className="flex justify-end py-3 px-10 sticky bottom-0 place_order_box bg-white tablet:hidden">
              <Link to={`/cart/address`}>
                <button className="py-4 px-16 rounded-md bg-orange-400 text-white font-semibold tracking-wide">
                  Placed Order
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div>No Cart</div>
        )}
      </section>
    </>
  );
};

export default Cart;
