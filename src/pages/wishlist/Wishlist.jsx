import { useSelector } from "react-redux";
import { localStorageState } from "../../redux/slice/localStorageSlice";
import Products from "./Products";
import { Helmet } from "react-helmet";

const Wishlist = () => {
  const { wishlist } = useSelector(localStorageState);

  return (
    <>
      <Helmet>
        <title>Wishlist</title>
        <meta name="description" content={`Wishlist of Commercify App`} />
      </Helmet>
      <section className="p-5 bg-gray-100">
        <main className="bg-white">
          <p className="py-5 px-10 text-xl">
            My Wishlist <span className="text-sm">({wishlist.length})</span>
          </p>
          {wishlist.length > 0 ? (
            <div>
              <Products list={wishlist} />
            </div>
          ) : (
            <div>No Wishlist</div>
          )}
        </main>
      </section>
    </>
  );
};

export default Wishlist;
