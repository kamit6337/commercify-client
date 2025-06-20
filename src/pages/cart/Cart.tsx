import { Helmet } from "react-helmet";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import Product from "./Product";
import { PRODUCT } from "@/types";
import PriceList from "@/components/PriceList";
import { useSelector } from "react-redux";
import { saleAndStockState } from "@/redux/slice/saleAndStockSlice";
import Toastify from "@/lib/Toastify";

type OUTLET = {
  products: PRODUCT[];
};

const Cart = () => {
  const navigate = useNavigate();
  const { products } = useOutletContext<OUTLET>();
  const { zeroStock, notReadyToSale } = useSelector(saleAndStockState);
  const { showErrorMessage } = Toastify();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  const handlePlaceOrder = () => {
    if (products.length === 0) return;

    const filterProducts = products.filter(
      (product) =>
        zeroStock.includes(product._id) || notReadyToSale.includes(product._id)
    );

    if (filterProducts.length === 0) {
      navigate(`/cart/address`);
      return;
    }

    const productTitle = filterProducts
      .map((product) => product.title)
      .join(", ");

    showErrorMessage({
      message: `${productTitle} either out of stock or out of sale. Please remove this from your cart tp place order.`,
    });
  };

  return (
    <>
      <Helmet>
        <title>Cart</title>
        <meta name="description" content={`Cart of Commercify App`} />
      </Helmet>

      <section className="">
        <p className="py-5 px-10 text-xl border-b bg-background">
          My Cart <span className="text-sm">({products.length})</span>
        </p>
        {products.length > 0 ? (
          <>
            <div className="space-y-5">
              <div className="bg-background">
                {products.map((product) => {
                  return <Product key={product._id} product={product} />;
                })}
              </div>
              <div className="md:hidden bg-background">
                <PriceList products={products} />
              </div>
            </div>
            <div className="flex justify-end py-3 px-10 border-t-2 sticky bottom-0 bg-background">
              <button
                className="py-4 px-16 rounded-md bg-orange-400 text-white font-semibold tracking-wide hover:brightness-90"
                onClick={() => handlePlaceOrder()}
              >
                Placed Order
              </button>
            </div>
          </>
        ) : (
          <div>No Cart</div>
        )}
      </section>
    </>
  );
};

export default Cart;
