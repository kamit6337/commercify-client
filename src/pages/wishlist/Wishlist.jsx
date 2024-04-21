import { useSelector } from "react-redux";
import { localStorageState } from "../../redux/slice/localStorageSlice";
import Products from "./Products";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const { wishlist } = useSelector(localStorageState);

  if (wishlist.length === 0) {
    return (
      <>
        <Helmet>
          <title>Wishlist</title>
          <meta name="description" content={`Wishlist of Commercify App`} />
        </Helmet>
        <section className="p-5 bg-gray-100">
          <main className="bg-white h-96 flex flex-col gap-4 justify-center items-center">
            <p className="text-lg">Your wishlist is empty!</p>
            <Link to={`/`}>
              <p className="bg-blue-500 py-3 px-20 text-sm text-white rounded-md">
                Shop Now
              </p>
            </Link>
          </main>
        </section>
      </>
    );
  }

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
